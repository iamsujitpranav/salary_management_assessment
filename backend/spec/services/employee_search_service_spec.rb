require "rails_helper"

RSpec.describe EmployeeSearchService do
  describe ".call" do
    before do
      create(:employee, first_name: "Ava", last_name: "Patel", job_title: "Senior Engineer", country: "India", salary: 120_000)
      create(:employee, first_name: "Noah", last_name: "Smith", job_title: "Product Manager", country: "United States", salary: 150_000)
    end

    it "returns filtered employees for a query" do
      result = described_class.call(q: "Patel")

      expect(result.total_count).to eq(1)
      expect(result.records.first.full_name).to eq("Ava Patel")
    end

    it "filters by country and job title" do
      result = described_class.call(country: "United States", job_title: "Product Manager")

      expect(result.total_count).to eq(1)
      expect(result.records.first.full_name).to eq("Noah Smith")
    end
  end
end
