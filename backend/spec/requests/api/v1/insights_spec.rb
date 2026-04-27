require "rails_helper"

RSpec.describe "Api::V1::Insights", type: :request do
  before do
    SalaryHistory.delete_all
    Employee.delete_all
    create(:employee, country: "India", job_title: "Senior Engineer", salary: 100_000, status: "active")
    create(:employee, country: "India", job_title: "HR Manager", salary: 80_000, status: "active")
    create(:employee, country: "United States", job_title: "Product Manager", salary: 140_000, status: "on_leave")
    create(:employee, country: "United States", job_title: "Engineer", salary: 120_000, status: "inactive")
  end

  it "returns overview metrics" do
    get "/api/v1/insights/overview"

    expect(response).to have_http_status(:ok)
    expect(JSON.parse(response.body)["overview"]["headcount"]).to eq(4)
  end

  it "returns filtered overview metrics by country" do
    get "/api/v1/insights/overview", params: { country: "India" }

    expect(response).to have_http_status(:ok)
    body = JSON.parse(response.body)
    expect(body["overview"]["headcount"]).to eq(2)
    expect(body["overview"]["average_salary"]).to eq(90_000.0)
  end

  it "returns filtered overview metrics by status" do
    get "/api/v1/insights/overview", params: { status: "active" }

    expect(response).to have_http_status(:ok)
    body = JSON.parse(response.body)
    expect(body["overview"]["headcount"]).to eq(2)
    expect(body["overview"]["average_salary"]).to eq(90_000.0)
  end

  it "returns filtered overview metrics by country and status" do
    get "/api/v1/insights/overview", params: { country: "United States", status: "on_leave" }

    expect(response).to have_http_status(:ok)
    body = JSON.parse(response.body)
    expect(body["overview"]["headcount"]).to eq(1)
    expect(body["overview"]["average_salary"]).to eq(140_000.0)
  end

  it "returns by country metrics" do
    get "/api/v1/insights/by_country"

    expect(response).to have_http_status(:ok)
    expect(JSON.parse(response.body)["countries"].map { |row| [row["country"], row["job_title"]] }).to contain_exactly(
      ["India", "HR Manager"],
      ["India", "Senior Engineer"],
      ["United States", "Engineer"],
      ["United States", "Product Manager"]
    )
  end

  it "returns by country metrics filtered by job title" do
    get "/api/v1/insights/by_country", params: { job_title: "Engineer" }

    expect(response).to have_http_status(:ok)
    body = JSON.parse(response.body)
    expect(body["countries"].map { |row| row["job_title"] }).to include("Senior Engineer")
  end

  it "returns no country metrics when the job title does not match" do
    get "/api/v1/insights/by_country", params: { job_title: "Architect" }

    expect(response).to have_http_status(:ok)
    expect(JSON.parse(response.body)["countries"]).to eq([])
  end

  it "returns by country metrics filtered by status" do
    get "/api/v1/insights/by_country", params: { status: "active" }

    expect(response).to have_http_status(:ok)
    body = JSON.parse(response.body)
    expect(body["countries"].size).to eq(2)
    expect(body["countries"].map { |row| row["country"] }).to all(eq("India"))
  end

  it "returns by country metrics filtered by status and job title" do
    get "/api/v1/insights/by_country", params: { status: "active", job_title: "Senior Engineer" }

    expect(response).to have_http_status(:ok)
    body = JSON.parse(response.body)
    expect(body["countries"].size).to eq(1)
    expect(body["countries"].first["country"]).to eq("India")
    expect(body["countries"].first["job_title"]).to eq("Senior Engineer")
  end

  it "returns by job title metrics" do
    get "/api/v1/insights/by_job_title", params: { country: "India" }

    expect(response).to have_http_status(:ok)
    body = JSON.parse(response.body)
    expect(body["job_titles"].map { |row| row["job_title"] }).to contain_exactly("HR Manager", "Senior Engineer")
  end

  it "returns a filtered job title metric" do
    get "/api/v1/insights/by_job_title", params: { country: "India", job_title: "Senior Engineer" }

    expect(response).to have_http_status(:ok)
    body = JSON.parse(response.body)
    expect(body["job_titles"].size).to eq(1)
    expect(body["job_titles"].first["job_title"]).to eq("Senior Engineer")
  end

  it "returns no job title metrics when the search matches nothing" do
    get "/api/v1/insights/by_job_title", params: { country: "India", job_title: "Architect" }

    expect(response).to have_http_status(:ok)
    expect(JSON.parse(response.body)["job_titles"]).to eq([])
  end

  it "returns by job title metrics filtered by status" do
    get "/api/v1/insights/by_job_title", params: { status: "active" }

    expect(response).to have_http_status(:ok)
    body = JSON.parse(response.body)
    expect(body["job_titles"].size).to eq(2)
    expect(body["job_titles"].map { |row| row["country"] }).to all(eq("India"))
  end

  it "returns by job title metrics filtered by status and country" do
    get "/api/v1/insights/by_job_title", params: { country: "United States", status: "on_leave" }

    expect(response).to have_http_status(:ok)
    body = JSON.parse(response.body)
    expect(body["job_titles"].size).to eq(1)
    expect(body["job_titles"].first["job_title"]).to eq("Product Manager")
    expect(body["job_titles"].first["country"]).to eq("United States")
  end

  it "serves the generated openapi document" do
    get "/openapi.json"

    expect(response).to have_http_status(:ok)
    body = JSON.parse(response.body)
    expect(body["openapi"]).to eq("3.0.3")
    expect(body["paths"]).to include("/api/v1/employees", "/api/v1/insights/overview")
  end
end
