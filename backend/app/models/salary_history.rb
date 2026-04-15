class SalaryHistory < ApplicationRecord
  # Each entry captures one salary change for an employee over time.
  belongs_to :employee

  # Keep the record complete so the history trail is usable for reporting.
  validates :previous_salary, :new_salary, :effective_date, presence: true
  validates :previous_salary, :new_salary, numericality: { greater_than_or_equal_to: 0 }
end
