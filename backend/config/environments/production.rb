require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local = false
  config.action_controller.perform_caching = true
  config.active_support.report_deprecations = false
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info")
  config.require_master_key = true
  config.secret_key_base = Rails.application.credentials.secret_key_base
end
