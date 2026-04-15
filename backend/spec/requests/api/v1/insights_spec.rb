require "rails_helper"

RSpec.describe "Api::V1::Insights", type: :request do
  before do
    SalaryHistory.delete_all
    Employee.delete_all
    create(:employee, country: "India", job_title: "Senior Engineer", salary: 100_000)
    create(:employee, country: "India", job_title: "HR Manager", salary: 80_000)
    create(:employee, country: "United States", job_title: "Product Manager", salary: 140_000)
  end

  it "returns overview metrics" do
    get "/api/v1/insights/overview"

    expect(response).to have_http_status(:ok)
    expect(JSON.parse(response.body)["overview"]["headcount"]).to eq(3)
  end

  it "returns filtered overview metrics" do
    get "/api/v1/insights/overview", params: { country: "India" }

    expect(response).to have_http_status(:ok)
    body = JSON.parse(response.body)
    expect(body["overview"]["headcount"]).to eq(2)
    expect(body["overview"]["average_salary"]).to eq(90_000.0)
  end

  it "returns by country metrics" do
    get "/api/v1/insights/by_country"

    expect(response).to have_http_status(:ok)
    expect(JSON.parse(response.body)["countries"].size).to eq(2)
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

  it "serves the generated openapi document" do
    get "/openapi.json"

    expect(response).to have_http_status(:ok)
    body = JSON.parse(response.body)
    expect(body["openapi"]).to eq("3.0.3")
    expect(body["paths"]).to include("/api/v1/employees", "/api/v1/insights/overview")
  end
end
