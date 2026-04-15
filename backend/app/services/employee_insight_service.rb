class EmployeeInsightService
  def self.overview
    new.overview
  end

  def self.by_country
    new.by_country
  end

  def self.by_job_title(country: nil)
    new(country:).by_job_title
  end

  def initialize(country: nil)
    @country = country
  end

  def overview
    {
      headcount: Employee.count,
      average_salary: Employee.average(:salary).to_f.round(2),
      minimum_salary: Employee.minimum(:salary).to_f.round(2),
      maximum_salary: Employee.maximum(:salary).to_f.round(2),
      top_country: top_country,
      employment_type_breakdown: employment_type_breakdown
    }
  end

  def by_country
    scope = Employee.all
    scope = scope.where(country: country) if country.present?

    scope.group(:country).order(:country).pluck(
      :country,
      Arel.sql("COUNT(*)"),
      Arel.sql("AVG(salary)"),
      Arel.sql("MIN(salary)"),
      Arel.sql("MAX(salary)")
    ).map do |country_name, count, average_salary, min_salary, max_salary|
      {
        country: country_name,
        headcount: count.to_i,
        average_salary: average_salary.to_f.round(2),
        minimum_salary: min_salary.to_f.round(2),
        maximum_salary: max_salary.to_f.round(2)
      }
    end
  end

  def by_job_title
    scope = Employee.all
    scope = scope.where(country: country) if country.present?

    scope.group(:job_title).order(:job_title).pluck(
      :job_title,
      Arel.sql("COUNT(*)"),
      Arel.sql("AVG(salary)")
    ).map do |title, count, average_salary|
      {
        job_title: title,
        headcount: count.to_i,
        average_salary: average_salary.to_f.round(2)
      }
    end
  end

  private

  attr_reader :country

  def top_country
    Employee.group(:country).order(Arel.sql("COUNT(*) DESC")).limit(1).pluck(:country).first
  end

  def employment_type_breakdown
    Employee.group(:employment_type).order(:employment_type).count
  end
end
