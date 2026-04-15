require "rails_helper"

RSpec.describe "Api::V1::Employees", type: :request do
  before do
    SalaryHistory.delete_all
    Employee.delete_all
  end

  let!(:employee) { create(:employee) }

  describe "GET /api/v1/employees" do
    it "returns paginated employees" do
      get "/api/v1/employees"

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body["employees"].first["full_name"]).to eq(employee.full_name)
    end
  end

  describe "POST /api/v1/employees" do
    it "creates an employee" do
      expect do
        post "/api/v1/employees", params: {
          employee: {
            first_name: "Maya",
            last_name: "Chen",
            job_title: "Designer",
            department: "Design",
            country: "Singapore",
            email: "maya.chen@example.com",
            salary: 95_000,
            currency: "SGD",
            employment_type: "full_time",
            hired_on: Date.new(2024, 1, 10),
            status: "active"
          }
        }
      end.to change(Employee, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it "returns bad request when the employee payload is missing" do
      post "/api/v1/employees"

      expect(response).to have_http_status(:bad_request)
      expect(JSON.parse(response.body)["error"]).to include("param is missing")
    end

    it "returns validation errors when required fields are missing" do
      post "/api/v1/employees", params: { employee: { first_name: "" } }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["errors"]).not_to be_empty
    end
  end

  describe "PATCH /api/v1/employees/:id" do
    it "updates an employee" do
      patch "/api/v1/employees/#{employee.id}", params: {
        employee: { salary: 130_000 }
      }

      expect(response).to have_http_status(:ok)
      expect(employee.reload.salary.to_i).to eq(130_000)
    end
  end

  describe "DELETE /api/v1/employees/:id" do
    it "deletes an employee" do
      expect do
        delete "/api/v1/employees/#{employee.id}"
      end.to change(Employee, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end

  describe "GET /api/v1/employees/:id" do
    it "returns an employee" do
      get "/api/v1/employees/#{employee.id}"

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["employee"]["full_name"]).to eq(employee.full_name)
    end

    it "returns not found for missing employees" do
      get "/api/v1/employees/999999"

      expect(response).to have_http_status(:not_found)
    end
  end
end
