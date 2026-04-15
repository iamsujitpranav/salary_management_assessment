Rails.application.routes.draw do
  get "/health", to: "health#show"
  get "/api-docs", to: redirect("/api-docs.html")
  get "/openapi.json", to: "api/v1/docs#show"

  namespace :api do
    namespace :v1 do
      resources :employees
      get "insights/overview", to: "insights#overview"
      get "insights/by_country", to: "insights#by_country"
      get "insights/by_job_title", to: "insights#by_job_title"
    end
  end
end
