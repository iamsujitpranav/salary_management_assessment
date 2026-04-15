module Api
  module V1
    class EmployeesController < ApplicationController
      before_action :set_employee, only: %i[show update destroy]

      def index
        # Search and pagination live in the service so this controller stays thin.
        result = EmployeeSearchService.call(
          page: params[:page],
          per_page: params[:per_page],
          q: params[:q],
          country: params[:country],
          job_title: params[:job_title],
          status: params[:status]
        )

        render json: {
          employees: result.records.map { |employee| employee_payload(employee) },
          meta: {
            page: result.page,
            per_page: result.per_page,
            total_count: result.total_count,
            total_pages: (result.total_count.to_f / result.per_page).ceil
          }
        }
      end

      def show
        render json: { employee: employee_payload(@employee) }
      end

      def create
        employee = Employee.new(employee_params)

        if employee.save
          render json: { employee: employee_payload(employee) }, status: :created
        else
          render json: { errors: employee.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @employee.update(employee_params)
          render json: { employee: employee_payload(@employee) }
        else
          render json: { errors: @employee.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @employee.destroy!
        head :no_content
      end

      private

      def set_employee
        @employee = Employee.find(params[:id])
      end

      def employee_params
        params.require(:employee).permit(
          :first_name,
          :last_name,
          :job_title,
          :department,
          :country,
          :email,
          :salary,
          :currency,
          :employment_type,
          :hired_on,
          :status
        )
      end

      def employee_payload(employee)
        # Shape the response once here so every endpoint returns the same fields.
        {
          id: employee.id,
          first_name: employee.first_name,
          last_name: employee.last_name,
          full_name: employee.full_name,
          job_title: employee.job_title,
          department: employee.department,
          country: employee.country,
          email: employee.email,
          salary: employee.salary.to_f,
          currency: employee.currency,
          employment_type: employee.employment_type,
          hired_on: employee.hired_on,
          status: employee.status,
          created_at: employee.created_at,
          updated_at: employee.updated_at
        }
      end
    end
  end
end
