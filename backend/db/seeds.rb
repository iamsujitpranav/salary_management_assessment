require "benchmark"

first_names = File.read(Rails.root.join("db/first_names.txt")).split.map(&:strip).reject(&:blank?)
last_names = File.read(Rails.root.join("db/last_names.txt")).split.map(&:strip).reject(&:blank?)
job_titles = [
  "Software Engineer",
  "Senior Engineer",
  "Engineering Manager",
  "Product Manager",
  "Designer",
  "Data Analyst",
  "HR Manager",
  "Finance Analyst",
  "Operations Specialist",
  "QA Engineer"
]
departments = ["Engineering", "Product", "Design", "People", "Finance", "Operations"]
countries = ["India", "United States", "United Kingdom", "Germany", "Canada", "Singapore", "Australia"]
employment_types = Employee::EMPLOYMENT_TYPES
statuses = Employee::STATUSES
currencies = { "India" => "INR", "United States" => "USD", "United Kingdom" => "GBP", "Germany" => "EUR", "Canada" => "CAD", "Singapore" => "SGD", "Australia" => "AUD" }

Employee.delete_all
SalaryHistory.delete_all

puts "Seeding employees..."
start_time = Process.clock_gettime(Process::CLOCK_MONOTONIC)

total_records = 10_000
batch_size = 1_000
records = []

srand(42)

total_records.times do |index|
  first_name = first_names[index % first_names.length]
  last_name = last_names[(index * 7) % last_names.length]
  country = countries[index % countries.length]
  salary_base = 30_000 + (index % 250) * 450
  salary = salary_base + rand(0..12_000)

  records << {
    first_name: first_name,
    last_name: last_name,
    job_title: job_titles[index % job_titles.length],
    department: departments[index % departments.length],
    country: country,
    email: "#{first_name.downcase}.#{last_name.downcase}.#{index}@example.com",
    salary: salary,
    currency: currencies.fetch(country),
    employment_type: employment_types[index % employment_types.length],
    hired_on: Date.new(2018 + (index % 6), ((index % 12) + 1), ((index % 28) + 1)),
    status: statuses[index % statuses.length],
    created_at: Time.current,
    updated_at: Time.current
  }

  next unless records.length >= batch_size

  Employee.insert_all(records)
  records.clear
end

Employee.insert_all(records) if records.any?

elapsed = Process.clock_gettime(Process::CLOCK_MONOTONIC) - start_time
puts format("Seeded %<count>d employees in %<seconds>.2fs", count: total_records, seconds: elapsed)
