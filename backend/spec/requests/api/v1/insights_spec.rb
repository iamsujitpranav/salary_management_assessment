require "rails_helper"

RSpec.describe "Api::V1::Insights", type: :request do
  before do
    create(:employee, country: "India", job_title: "Senior Engineer", salary: 100_000)
    create(:employee, country: "India", job_title: "HR Manager", salary: 80_000)
    create(:employee, country: "United States", job_title: "Product Manager", salary: 140_000)
  end

  it "returns overview metrics" do
    get "/api/v1/insights/overview"

    expect(response).to have_http_status(:ok)
    expect(JSON.parse(response.body)["overview"]["headcount"]).to eq(3)
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
end
