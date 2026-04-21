require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local = false
  config.hosts << "salary-management-assessment.onrender.com"
  config.hosts << /.*\.onrender\.com\z/
  config.action_controller.perform_caching = true
  config.active_support.report_deprecations = false
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info")
  config.require_master_key = true
  config.secret_key_base = Rails.application.credentials.secret_key_base

  config.after_initialize do
    Rails.logger.info("[deploy-debug] Render hostname: #{ENV.fetch("RENDER_EXTERNAL_HOSTNAME", "NOT_SET")}")
    Rails.logger.info("[deploy-debug] Allowed hosts: #{Rails.application.config.hosts.inspect}")
  end
end
