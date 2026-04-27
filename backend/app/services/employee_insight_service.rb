class EmployeeInsightService
  def self.overview(country: nil, status: nil)
    new(country:, status:).overview
  end

  def self.by_country(country: nil, job_title: nil, status: nil)
    new(country:, job_title:, status:).by_country
  end

  def self.by_job_title(country: nil, job_title: nil, status: nil)
    new(country:, job_title:, status:).by_job_title
  end

  def initialize(country: nil, job_title: nil, status: nil)
    @country = country
    @job_title = job_title
    @status = status
  end

  def overview
    # This powers the dashboard summary cards and stays fully aggregated in SQL.
    scope = filtered_scope

    {
      headcount: scope.count,
      average_salary: scope.average(:salary).to_f.round(2),
      minimum_salary: scope.minimum(:salary).to_f.round(2),
      maximum_salary: scope.maximum(:salary).to_f.round(2),
      top_country: top_country(scope),
      employment_type_breakdown: employment_type_breakdown(scope)
    }
  end

  def by_country
    scope = filtered_scope
    scope = scope.with_job_title(job_title)

    # Grouping at the database layer keeps country-level rollups fast and predictable.
    scope.group(:country, :job_title).order(:country, :job_title).pluck(
      :country,
      :job_title,
      Arel.sql("COUNT(*)"),
      Arel.sql("AVG(salary)"),
      Arel.sql("MIN(salary)"),
      Arel.sql("MAX(salary)")
    ).map do |country_name, title, count, average_salary, min_salary, max_salary|
      {
        country: country_name,
        job_title: title,
        headcount: count.to_i,
        average_salary: average_salary.to_f.round(2),
        minimum_salary: min_salary.to_f.round(2),
        maximum_salary: max_salary.to_f.round(2)
      }
    end
  end

  def by_job_title
    scope = filtered_scope
    scope = scope.with_job_title(job_title)

    # Reuse the same filtered scope so title-based drill-downs match the country filter.
    scope.group(:job_title, :country).order(:job_title, :country).pluck(
      :job_title,
      :country,
      Arel.sql("COUNT(*)"),
      Arel.sql("AVG(salary)")
    ).map do |title, country_name, count, average_salary|
      {
        job_title: title,
        country: country_name,
        headcount: count.to_i,
        average_salary: average_salary.to_f.round(2)
      }
    end
  end

  private

  attr_reader :country, :job_title, :status

  def filtered_scope
    scope = Employee.all
    scope = scope.in_country(country)
    scope = scope.with_status(status)
    scope
  end

  def top_country(scope)
    # The dashboard only needs the single highest-headcount country.
    scope.group(:country).order(Arel.sql("COUNT(*) DESC")).limit(1).pluck(:country).first
  end

  def employment_type_breakdown(scope)
    # This gives the UI a compact headcount split by employment type.
    scope.group(:employment_type).order(:employment_type).count
  end
end
