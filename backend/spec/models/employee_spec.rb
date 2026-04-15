require "rails_helper"

RSpec.describe Employee, type: :model do
  subject(:employee) { build(:employee) }

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

  it "returns all employees when the country and job title filters are blank" do
    create(:employee, country: "Japan", job_title: "Analyst")

    expect(Employee.in_country(nil).count).to be >= 2
    expect(Employee.with_job_title(nil).count).to be >= 2
  end
end
