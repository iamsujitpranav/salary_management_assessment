require "rails_helper"

RSpec.describe SalaryHistory, type: :model do
  subject(:salary_history) { build(:salary_history) }

  it { is_expected.to belong_to(:employee) }
  it { is_expected.to validate_presence_of(:previous_salary) }
  it { is_expected.to validate_presence_of(:new_salary) }
  it { is_expected.to validate_presence_of(:effective_date) }

  it "is invalid with a negative salary" do
    salary_history.new_salary = -1

    expect(salary_history).not_to be_valid
  end
end
