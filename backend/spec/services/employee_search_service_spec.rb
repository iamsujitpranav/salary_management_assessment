require "rails_helper"

RSpec.describe EmployeeSearchService do
  describe ".call" do
    before do
      SalaryHistory.delete_all
      Employee.delete_all
      create(:employee, first_name: "Zara", last_name: "Quinn", job_title: "Chief Architect", country: "Atlantis", salary: 120_000)
      create(:employee, first_name: "Milo", last_name: "Stone", job_title: "Product Strategist", country: "El Dorado", salary: 150_000)
    end

    it "returns all employees when the query is blank" do
      result = described_class.call(q: nil)

      expect(result.total_count).to eq(2)
      expect(result.records.size).to eq(2)
    end

    it "returns filtered employees for a query" do
      result = described_class.call(q: "Quinn")

      expect(result.total_count).to eq(1)
      expect(result.records.first.full_name).to eq("Zara Quinn")
    end

    # Partial query test: ensures the service supports substring searches for predictable filtering.
    # Validates that "strat" matches "Product Strategist" across the searchable roster fields.
    it "matches partial query terms across searchable fields" do
      result = described_class.call(q: "strat")

      expect(result.total_count).to eq(1)
      expect(result.records.first.full_name).to eq("Milo Stone")
    end

    it "filters by country and job title" do
      result = described_class.call(country: "El Dorado", job_title: "Product Strategist")

      expect(result.total_count).to eq(1)
      expect(result.records.first.full_name).to eq("Milo Stone")
    end

    it "matches country filters case-insensitively" do
      result = described_class.call(country: "el dorado")

      expect(result.total_count).to eq(1)
      expect(result.records.first.full_name).to eq("Milo Stone")
    end

    it "falls back to the default pagination values when invalid values are passed" do
      result = described_class.call(page: 0, per_page: 0)

      expect(result.page).to eq(1)
      expect(result.per_page).to eq(EmployeeSearchService::DEFAULT_PER_PAGE)
    end

    it "filters by status" do
      create(:employee, first_name: "Lena", last_name: "Hart", status: "inactive", email: "lena.hart@example.com")

      result = described_class.call(status: "inactive")

      expect(result.total_count).to eq(1)
      expect(result.records.first.full_name).to eq("Lena Hart")
    end
  end
end
