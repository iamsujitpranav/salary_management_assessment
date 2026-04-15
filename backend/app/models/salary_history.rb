class SalaryHistory < ApplicationRecord
  belongs_to :employee

  validates :previous_salary, :new_salary, :effective_date, presence: true
  validates :previous_salary, :new_salary, numericality: { greater_than_or_equal_to: 0 }
end
