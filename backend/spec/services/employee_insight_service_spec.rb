require "rails_helper"

RSpec.describe EmployeeInsightService do
  before do
    create(:employee, country: "India", job_title: "Senior Engineer", salary: 100_000)
    create(:employee, country: "India", job_title: "HR Manager", salary: 80_000)
    create(:employee, country: "United States", job_title: "Product Manager", salary: 140_000)
  end

  describe ".overview" do
    it "returns headcount and salary metrics" do
      overview = described_class.overview

      expect(overview[:headcount]).to eq(3)
      expect(overview[:average_salary]).to eq(106_666.67)
      expect(overview[:minimum_salary]).to eq(80_000.0)
      expect(overview[:maximum_salary]).to eq(140_000.0)
      expect(overview[:top_country]).to eq("India")
    end
  end

  describe ".by_country" do
    it "returns aggregated metrics per country" do
      countries = described_class.by_country

      expect(countries.map { |row| row[:country] }).to contain_exactly("India", "United States")
    end
  end

  describe ".by_job_title" do
    it "returns aggregated metrics per title" do
      titles = described_class.by_job_title(country: "India")

      expect(titles.map { |row| row[:job_title] }).to contain_exactly("HR Manager", "Senior Engineer")
    end
  end
end
