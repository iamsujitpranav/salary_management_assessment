require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.cache_classes = true
  config.eager_load = false
  config.consider_all_requests_local = true
  config.hosts << "localhost"
  config.action_controller.perform_caching = false
  config.active_support.deprecation = :stderr
  config.active_record.verbose_query_logs = false
end
