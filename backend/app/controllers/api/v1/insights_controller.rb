module Api
  module V1
    class InsightsController < ApplicationController
      def overview
        render json: { overview: EmployeeInsightService.overview }
      end

      def by_country
        render json: { countries: EmployeeInsightService.by_country }
      end

      def by_job_title
        render json: { job_titles: EmployeeInsightService.by_job_title(country: params[:country]) }
      end
    end
  end
end
