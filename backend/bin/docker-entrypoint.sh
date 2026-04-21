#!/bin/bash
set -e

# Debug: print deployment-time environment and the database config Rails will load.
echo "=== DEPLOY DEBUG ==="
echo "RAILS_ENV: ${RAILS_ENV:-NOT_SET}"
echo "DATABASE_URL set: ${DATABASE_URL:+yes}${DATABASE_URL:-no}"
echo "DATABASE_HOST: ${DATABASE_HOST:-NOT_SET}"
echo "DATABASE_USER: ${DATABASE_USER:-NOT_SET}"
echo "DATABASE_NAME: ${DATABASE_NAME:-NOT_SET}"
echo "DATABASE_PASSWORD set: ${DATABASE_PASSWORD:+yes}${DATABASE_PASSWORD:-no}"
echo "VITE_API_URL: ${VITE_API_URL:-NOT_SET}"
echo "Resolved production database.yml:"
bundle exec ruby -e 'require "erb"; require "yaml"; require "pp"; config = YAML.safe_load(ERB.new(File.read("config/database.yml")).result, aliases: true); pp config["production"]' || true
echo "===================="

# Skip database wait check for production deployments (Render, Heroku, etc.)
# Cloud databases are ready before containers start, so no wait check needed
if [ "$RAILS_ENV" = "development" ]; then
  # Wait for database to be ready in local development
  until PGPASSWORD=$DATABASE_PASSWORD psql -h "$DATABASE_HOST" -U "$DATABASE_USER" -d "postgres" -c '\q'; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 1
  done
  echo "PostgreSQL is up - executing command"
fi

# Run migrations
echo "Running database migrations..."
bundle exec rails db:migrate

# Run seeds only in development environment
if [ "$RAILS_ENV" = "development" ]; then
  echo "Running database seeds..."
  bundle exec rails db:seed
fi

# Execute the main command
exec "$@"
