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
end
