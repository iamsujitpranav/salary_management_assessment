require "rails_helper"

RSpec.describe EmployeeInsightService do
  before do
    SalaryHistory.delete_all
    Employee.delete_all
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

    it "filters overview metrics by country" do
      overview = described_class.overview(country: "India")

      expect(overview[:headcount]).to eq(2)
      expect(overview[:average_salary]).to eq(90_000.0)
      expect(overview[:minimum_salary]).to eq(80_000.0)
      expect(overview[:maximum_salary]).to eq(100_000.0)
      expect(overview[:top_country]).to eq("India")
      expect(overview[:employment_type_breakdown]).to be_a(Hash)
    end
  end

  describe ".by_country" do
    it "returns aggregated metrics per country" do
      countries = described_class.by_country

      expect(countries.map { |row| [row[:country], row[:job_title]] }).to contain_exactly(
        ["India", "HR Manager"],
        ["India", "Senior Engineer"],
        ["United States", "Product Manager"]
      )
    end

    it "filters by job title" do
      countries = described_class.by_country(job_title: "Senior Engineer")

      expect(countries.size).to eq(1)
      expect(countries.first[:country]).to eq("India")
      expect(countries.first[:job_title]).to eq("Senior Engineer")
    end

    it "supports partial job title searches" do
      countries = described_class.by_country(job_title: "Engineer")

      expect(countries.map { |row| row[:job_title] }).to include("Senior Engineer")
    end

    it "returns no rows when the job title search matches nothing" do
      countries = described_class.by_country(job_title: "Architect")

      expect(countries).to be_empty
    end
  end

  describe ".by_job_title" do
    it "returns aggregated metrics per title" do
      titles = described_class.by_job_title(country: "India")

      expect(titles.map { |row| [row[:job_title], row[:country]] }).to contain_exactly(["HR Manager", "India"], ["Senior Engineer", "India"])
    end

    it "filters by country and job title" do
      titles = described_class.by_job_title(country: "India", job_title: "Senior Engineer")

      expect(titles.size).to eq(1)
      expect(titles.first[:job_title]).to eq("Senior Engineer")
      expect(titles.first[:country]).to eq("India")
      expect(titles.first[:headcount]).to eq(1)
    end

    it "returns no rows when the job title search matches nothing" do
      titles = described_class.by_job_title(country: "India", job_title: "Architect")

      expect(titles).to be_empty
    end

    it "returns an empty overview when there are no employees" do
      SalaryHistory.delete_all
      Employee.delete_all

      overview = described_class.overview

      expect(overview[:headcount]).to eq(0)
      expect(overview[:top_country]).to be_nil
      expect(overview[:employment_type_breakdown]).to eq({})
    end
  end
end
