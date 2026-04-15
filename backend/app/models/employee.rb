class Employee < ApplicationRecord
  has_many :salary_histories, dependent: :destroy

  STATUSES = %w[active on_leave inactive terminated].freeze
  EMPLOYMENT_TYPES = %w[full_time part_time contract intern temporary].freeze

  # Normalize input before validations so persisted employee data stays consistent.
  before_validation :normalize_attributes

  validates :first_name, :last_name, :job_title, :department, :country, :email, :salary, :currency, :employment_type, :hired_on, :status, presence: true
  validates :email, uniqueness: { case_sensitive: false }
  validates :salary, numericality: { greater_than_or_equal_to: 0 }
  validates :status, inclusion: { in: STATUSES }
  validates :employment_type, inclusion: { in: EMPLOYMENT_TYPES }

  # Partial text search matches name, title, and department substrings for predictable root-page filtering.
  # Each term is ANDed across the concatenated roster fields using case-insensitive LIKE.
  scope :searching, lambda { |query|
    return all if query.blank?

    terms = query.to_s.split(/\s+/).map(&:strip).reject(&:blank?)
    searchable_fields = "LOWER(CONCAT_WS(' ', first_name, last_name, job_title, department))"

    terms.reduce(all) do |relation, term|
      pattern = "%#{ActiveRecord::Base.sanitize_sql_like(term.downcase)}%"
      relation.where("#{searchable_fields} LIKE ?", pattern)
    end
  }

  scope :in_country, lambda { |country|
    return all if country.blank?

    normalized_country = country.to_s.strip.downcase
    where('LOWER(TRIM(country)) = ?', normalized_country)
  }
  scope :with_job_title, lambda { |job_title|
    return all if job_title.blank?

    normalized_job_title = "%#{job_title.to_s.strip.downcase}%"
    where('LOWER(TRIM(job_title)) LIKE ?', normalized_job_title)
  }
  scope :with_status, ->(status) { status.present? ? where(status:) : all }

  def full_name
    [first_name, last_name].compact.join(" ")
  end

  def salary_in_base_currency
    salary
  end

  private

  # Keep names, currency, and status in the same format that the API and seeds expect.
  def normalize_attributes
    self.first_name = first_name.to_s.strip.titleize
    self.last_name = last_name.to_s.strip.titleize
    self.job_title = job_title.to_s.strip
    self.department = department.to_s.strip
    self.country = country.to_s.strip.titleize
    self.email = email.to_s.strip.downcase
    self.currency = currency.to_s.strip.upcase
    self.employment_type = employment_type.to_s.strip
    self.status = status.to_s.strip
  end
end
