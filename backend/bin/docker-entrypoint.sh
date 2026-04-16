#!/bin/bash
set -e

# Wait for database to be ready if using individual env vars (Docker Compose)
# Skip wait check when DATABASE_URL is set (Render, Heroku, etc.) as cloud databases are ready before containers
if [ -z "$DATABASE_URL" ]; then
  until PGPASSWORD=$DATABASE_PASSWORD psql -h "$DATABASE_HOST" -U "$DATABASE_USER" -d "postgres" -c '\q'; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 1
  done
  echo "PostgreSQL is up - executing command"
else
  echo "Using DATABASE_URL for database connection (skipping wait check)"
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
