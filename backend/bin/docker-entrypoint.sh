#!/bin/bash
set -e

# Debug: Print environment variables
echo "=== DEBUG INFO ==="
echo "RAILS_ENV: $RAILS_ENV"
echo "DATABASE_URL: ${DATABASE_URL:-NOT_SET}"
echo "DATABASE_HOST: ${DATABASE_HOST:-NOT_SET}"
echo "DATABASE_USER: ${DATABASE_USER:-NOT_SET}"
echo "DATABASE_NAME: ${DATABASE_NAME:-NOT_SET}"
echo "=================="

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
