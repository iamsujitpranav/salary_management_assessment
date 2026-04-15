Rails.application.routes.draw do
  get "/health", to: "health#show"

  namespace :api do
    namespace :v1 do
      resources :employees
      get "insights/overview", to: "insights#overview"
      get "insights/by_country", to: "insights#by_country"
      get "insights/by_job_title", to: "insights#by_job_title"
    end
  end
end
