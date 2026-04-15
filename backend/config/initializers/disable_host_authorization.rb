if Rails.env.test?
  Rails.application.config.middleware.delete ActionDispatch::HostAuthorization
end
