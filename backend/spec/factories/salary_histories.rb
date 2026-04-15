FactoryBot.define do
  factory :salary_history do
    association :employee
    previous_salary { 100_000 }
    new_salary { 120_000 }
    reason { "Annual adjustment" }
    effective_date { Date.current }
  end
end
