class EmployeeSearchService
  Result = Struct.new(:records, :total_count, :page, :per_page, keyword_init: true)

  DEFAULT_PER_PAGE = 25

  def self.call(scope: Employee.all, page: 1, per_page: DEFAULT_PER_PAGE, q: nil, country: nil, job_title: nil, status: nil)
    new(scope:, page:, per_page:, q:, country:, job_title:, status:).call
  end

  def initialize(scope:, page:, per_page:, q:, country:, job_title:, status:)
    @scope = scope
    @page = page.to_i <= 0 ? 1 : page.to_i
    @per_page = per_page.to_i <= 0 ? DEFAULT_PER_PAGE : per_page.to_i
    @q = q
    @country = country
    @job_title = job_title
    @status = status
  end

  def call
    # Keep the total count tied to the filtered relation so pagination metadata stays accurate.
    filtered = scope.searching(q)
                    .in_country(country)
                    .with_job_title(job_title)
                    .with_status(status)

    # Use a stable order so the same query returns the same page boundaries.
    ordered = filtered.order(:last_name, :first_name, :id)

    Result.new(
      records: ordered.offset(offset_value).limit(per_page),
      total_count: filtered.count,
      page: page,
      per_page: per_page
    )
  end

  private

  attr_reader :scope, :page, :per_page, :q, :country, :job_title, :status

  def offset_value
    (page - 1) * per_page
  end
end
