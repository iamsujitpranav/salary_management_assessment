module Api
  module V1
    class InsightsController < ApplicationController
      def overview
        # The service keeps these summary calculations out of the controller.
        render json: { overview: EmployeeInsightService.overview(country: params[:country]) }
      end

      def by_country
        # Country-level insight is still served through the same service entry point.
        render json: { countries: EmployeeInsightService.by_country(country: params[:country], job_title: params[:job_title]) }
      end

      def by_job_title
        # Job-title drill-down can optionally reuse the country filter.
        render json: { job_titles: EmployeeInsightService.by_job_title(country: params[:country], job_title: params[:job_title]) }
      end
    end
  end
end
