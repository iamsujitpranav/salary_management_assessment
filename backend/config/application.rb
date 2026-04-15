require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module SalaryManagement
  class Application < Rails::Application
    config.load_defaults 8.1
    config.api_only = true
    config.eager_load_paths << Rails.root.join("app/services")
    config.generators do |g|
      g.test_framework :rspec,
        fixtures: true,
        view_specs: false,
        helper_specs: false,
        routing_specs: false,
        request_specs: true
      g.fixture_replacement :factory_bot, dir: "spec/factories"
    end
  end
end
