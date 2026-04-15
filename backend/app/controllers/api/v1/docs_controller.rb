module Api
  module V1
    class DocsController < ApplicationController
      def show
        render json: OpenApiDocumentBuilder.call
      end
    end
  end
end
