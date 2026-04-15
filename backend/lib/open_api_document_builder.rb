class OpenApiDocumentBuilder
  API_VERSION = "1.0.0"
  TITLE = "Salary Management API"

  def self.call
    new.call
  end

  def call
    {
      openapi: "3.0.3",
      info: {
        title: TITLE,
        version: API_VERSION,
        description: "OpenAPI specification for the salary management backend"
      },
      servers: [
        { url: "/", description: "Current server" }
      ],
      paths: paths,
      components: {
        schemas: schemas
      }
    }
  end

  private

  def paths
    {
      "/health" => {
        get: operation("Health check", response_ref("HealthResponse"))
      },
      "/api/v1/employees" => {
        get: employee_index_operation,
        post: employee_create_operation
      },
      "/api/v1/employees/{id}" => {
        get: employee_show_operation,
        patch: employee_update_operation,
        delete: employee_destroy_operation
      },
      "/api/v1/insights/overview" => {
        get: insight_overview_operation
      },
      "/api/v1/insights/by_country" => {
        get: insight_country_operation
      },
      "/api/v1/insights/by_job_title" => {
        get: insight_job_title_operation
      }
    }
  end

  def schemas
    {
      HealthResponse: {
        type: :object,
        properties: {
          status: { type: :string, example: "ok" }
        },
        required: %w[status]
      },
      Employee: {
        type: :object,
        properties: employee_properties,
        required: employee_properties.keys.map(&:to_s)
      },
      EmployeeInput: {
        type: :object,
        properties: employee_input_properties,
        required: employee_input_properties.keys.map(&:to_s)
      },
      EmployeeListResponse: {
        type: :object,
        properties: {
          employees: { type: :array, items: { "$ref": "#/components/schemas/Employee" } },
          meta: { "$ref": "#/components/schemas/PaginationMeta" }
        },
        required: %w[employees meta]
      },
      EmployeeResponse: {
        type: :object,
        properties: {
          employee: { "$ref": "#/components/schemas/Employee" }
        },
        required: %w[employee]
      },
      PaginationMeta: {
        type: :object,
        properties: {
          page: { type: :integer },
          per_page: { type: :integer },
          total_count: { type: :integer },
          total_pages: { type: :integer }
        },
        required: %w[page per_page total_count total_pages]
      },
      ErrorsResponse: {
        type: :object,
        properties: {
          errors: { type: :array, items: { type: :string } }
        },
        required: %w[errors]
      },
      InsightOverviewResponse: {
        type: :object,
        properties: {
          overview: { "$ref": "#/components/schemas/InsightOverview" }
        },
        required: %w[overview]
      },
      CountryInsightsResponse: {
        type: :object,
        properties: {
          countries: { type: :array, items: { "$ref": "#/components/schemas/CountryInsight" } }
        },
        required: %w[countries]
      },
      JobTitleInsightsResponse: {
        type: :object,
        properties: {
          job_titles: { type: :array, items: { "$ref": "#/components/schemas/JobTitleInsight" } }
        },
        required: %w[job_titles]
      },
      InsightOverview: {
        type: :object,
        properties: {
          headcount: { type: :integer },
          average_salary: { type: :number },
          minimum_salary: { type: :number },
          maximum_salary: { type: :number },
          top_country: { type: [:string, :null] },
          employment_type_breakdown: { type: :object, additionalProperties: { type: :integer } }
        },
        required: %w[headcount average_salary minimum_salary maximum_salary top_country employment_type_breakdown]
      },
      CountryInsight: {
        type: :object,
        properties: {
          country: { type: :string },
          headcount: { type: :integer },
          average_salary: { type: :number },
          minimum_salary: { type: :number },
          maximum_salary: { type: :number }
        },
        required: %w[country headcount average_salary minimum_salary maximum_salary]
      },
      JobTitleInsight: {
        type: :object,
        properties: {
          job_title: { type: :string },
          headcount: { type: :integer },
          average_salary: { type: :number }
        },
        required: %w[job_title headcount average_salary]
      }
    }
  end

  def employee_properties
    {
      id: { type: :integer },
      first_name: { type: :string },
      last_name: { type: :string },
      full_name: { type: :string },
      job_title: { type: :string },
      department: { type: :string },
      country: { type: :string },
      email: { type: :string, format: :email },
      salary: { type: :number },
      currency: { type: :string },
      employment_type: { type: :string },
      hired_on: { type: :string, format: :date },
      status: { type: :string },
      created_at: { type: :string, format: :date_time },
      updated_at: { type: :string, format: :date_time }
    }
  end

  def employee_input_properties
    employee_properties.except(:id, :full_name, :created_at, :updated_at)
  end

  def operation(summary, response_schema)
    {
      summary: summary,
      responses: {
        "200" => {
          description: "successful",
          content: {
            "application/json" => {
              schema: response_schema
            }
          }
        }
      }
    }
  end

  def employee_index_operation
    operation("List employees", { "$ref": "#/components/schemas/EmployeeListResponse" }).merge(
      parameters: paging_and_filter_parameters
    )
  end

  def employee_show_operation
    operation("Show employee", { "$ref": "#/components/schemas/EmployeeResponse" }).merge(
      parameters: [path_id_parameter]
    )
  end

  def employee_create_operation
    operation("Create employee", { "$ref": "#/components/schemas/EmployeeResponse" }).merge(
      requestBody: request_body("EmployeeInput"),
      responses: success_and_error_responses("created")
    )
  end

  def employee_update_operation
    operation("Update employee", { "$ref": "#/components/schemas/EmployeeResponse" }).merge(
      parameters: [path_id_parameter],
      requestBody: request_body("EmployeeInput"),
      responses: success_and_error_responses("ok")
    )
  end

  def employee_destroy_operation
    {
      summary: "Delete employee",
      parameters: [path_id_parameter],
      responses: {
        "204" => { description: "no content" }
      }
    }
  end

  def insight_overview_operation
    operation("Salary overview", { "$ref": "#/components/schemas/InsightOverviewResponse" }).merge(
      parameters: [country_parameter]
    )
  end

  def insight_country_operation
    operation("Salary by country", { "$ref": "#/components/schemas/CountryInsightsResponse" }).merge(
      parameters: [country_parameter]
    )
  end

  def insight_job_title_operation
    operation("Salary by job title", { "$ref": "#/components/schemas/JobTitleInsightsResponse" }).merge(
      parameters: [country_parameter, job_title_parameter]
    )
  end

  def paging_and_filter_parameters
    [
      { name: "page", in: :query, schema: { type: :integer }, required: false },
      { name: "per_page", in: :query, schema: { type: :integer }, required: false },
      { name: "q", in: :query, schema: { type: :string }, required: false },
      { name: "country", in: :query, schema: { type: :string }, required: false },
      { name: "job_title", in: :query, schema: { type: :string }, required: false },
      { name: "status", in: :query, schema: { type: :string }, required: false }
    ]
  end

  def path_id_parameter
    { name: "id", in: :path, required: true, schema: { type: :integer } }
  end

  def country_parameter
    { name: "country", in: :query, required: false, schema: { type: :string } }
  end

  def job_title_parameter
    { name: "job_title", in: :query, required: false, schema: { type: :string } }
  end

  def request_body(schema_name)
    {
      required: true,
      content: {
        "application/json" => {
          schema: { "$ref": "#/components/schemas/#{schema_name}" }
        }
      }
    }
  end

  def success_and_error_responses(status)
    {
      responses: {
        status => {
          description: status == "created" ? "created" : "ok",
          content: {
            "application/json" => {
              schema: { "$ref": "#/components/schemas/EmployeeResponse" }
            }
          }
        },
        "422" => {
          description: "unprocessable entity",
          content: {
            "application/json" => {
              schema: { "$ref": "#/components/schemas/ErrorsResponse" }
            }
          }
        },
        "400" => {
          description: "bad request",
          content: {
            "application/json" => {
              schema: { type: :object, properties: { error: { type: :string } } }
            }
          }
        }
      }
    }
  end

  def response_ref(schema_name)
    {
      "$ref": "#/components/schemas/#{schema_name}"
    }
  end
end
