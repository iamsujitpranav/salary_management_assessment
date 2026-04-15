FactoryBot.define do
  factory :employee do
    first_name { "Ava" }
    last_name { "Patel" }
    job_title { "Senior Engineer" }
    department { "Engineering" }
    country { "India" }
    sequence(:email) { |n| "ava.patel#{n}@example.com" }
    salary { 120_000 }
    currency { "USD" }
    employment_type { "full_time" }
    hired_on { Date.new(2023, 1, 15) }
    status { "active" }
  end
end
