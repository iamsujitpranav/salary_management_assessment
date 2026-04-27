require "rails_helper"

RSpec.describe Employee, type: :model do
  subject(:employee) { build(:employee) }

  before do
    SalaryHistory.delete_all
    Employee.delete_all
  end

  it { is_expected.to have_many(:salary_histories).dependent(:destroy) }
  it { is_expected.to validate_presence_of(:first_name) }
  it { is_expected.to validate_presence_of(:last_name) }
  it { is_expected.to validate_presence_of(:job_title) }
  it { is_expected.to validate_presence_of(:department) }
  it { is_expected.to validate_presence_of(:country) }
  it { is_expected.to validate_presence_of(:email) }
  it { is_expected.to validate_presence_of(:salary) }
  it { is_expected.to validate_presence_of(:currency) }
  it { is_expected.to validate_presence_of(:employment_type) }
  it { is_expected.to validate_presence_of(:hired_on) }
  it { is_expected.to validate_presence_of(:status) }
  it { is_expected.to validate_numericality_of(:salary).is_greater_than_or_equal_to(0) }

  it "is invalid without first_name" do
    employee.first_name = nil

    expect(employee).not_to be_valid
  end

  it "builds a full name" do
    expect(employee.full_name).to eq("Ava Patel")
  end

  it "normalizes the email to lowercase" do
    employee.email = "AVA.PATEL@EXAMPLE.COM"
    employee.valid?

    expect(employee.email).to eq("ava.patel@example.com")
  end

  it "normalizes names, country, currency, and status" do
    employee.first_name = "  maya  "
    employee.last_name = "  chen  "
    employee.job_title = "  product manager  "
    employee.department = "  growth  "
    employee.country = "  singapore  "
    employee.currency = "  sgd  "
    employee.employment_type = " part_time "
    employee.status = " active "

    employee.valid?

    expect(employee.first_name).to eq("Maya")
    expect(employee.last_name).to eq("Chen")
    expect(employee.job_title).to eq("product manager")
    expect(employee.department).to eq("growth")
    expect(employee.country).to eq("Singapore")
    expect(employee.currency).to eq("SGD")
    expect(employee.employment_type).to eq("part_time")
    expect(employee.status).to eq("active")
  end

  it "returns the salary in base currency" do
    expect(employee.salary_in_base_currency).to eq(120_000)
  end

  it "searches employees with the full-text scope" do
    create(:employee, first_name: "Zara", last_name: "Quinn", job_title: "Architect")

    expect(Employee.searching("Quinn").map(&:full_name)).to include("Zara Quinn")
  end

  # Partial matching test: ensures substring searches work across name, title, and department fields.
  # This validates the root-page search behavior for terms like "des" matching "Designer".
  it "matches partial terms in the searchable roster fields" do
    create(:employee, first_name: "Maya", last_name: "Chen", job_title: "Designer", department: "Design")

    expect(Employee.searching("des").map(&:full_name)).to include("Maya Chen")
  end

  it "returns all employees when the country and job title filters are blank" do
    create(:employee, country: "Japan", job_title: "Analyst")

    expect(Employee.in_country(nil).count).to eq(1)
    expect(Employee.with_job_title(nil).count).to eq(1)
  end

  it "filters employees by status" do
    create(:employee, status: "active")
    create(:employee, status: "inactive", email: "inactive@example.com")

    expect(Employee.with_status("inactive").map(&:status)).to contain_exactly("inactive")
  end

  it "supports partial job title matching" do
    create(:employee, job_title: "Designer")
    create(:employee, job_title: "Data Analyst", email: "data.analyst@example.com")

    expect(Employee.with_job_title("des").map(&:job_title)).to include("Designer")
    expect(Employee.with_job_title("data").map(&:job_title)).to include("Data Analyst")
  end

  it "is invalid with a future hired_on date" do
    employee.hired_on = Date.tomorrow + 1

    expect(employee).not_to be_valid
    expect(employee.errors[:hired_on]).to include("must be on or before today")
  end

  it "is valid with today's hired_on date" do
    employee.hired_on = Date.today

    expect(employee).to be_valid
  end

  it "is valid with a past hired_on date" do
    employee.hired_on = Date.yesterday

    expect(employee).to be_valid
  end
end
