# Salary Management Assessment

A minimal yet usable salary management tool for HR managers, built with:

- Rails 8.1 API-only backend
- PostgreSQL 16 with full-text search and GIN indexing
- React 18 + TypeScript + Vite frontend
- TailwindCSS, Framer Motion, Zustand, and React Query
- RSpec and React Testing Library/Vitest for tests

## Structure

- `backend/` — Rails API, domain models, services, and RSpec suite
- `frontend/` — React UI with server-state caching and animated dashboard components
- `docs/` — architecture notes, ADRs, and prompts used while building

## Development

### Docker Setup (Recommended)

The application is configured to run with Docker Compose. Simply run:

```bash
docker compose up --build
```

The app exposes:

- Frontend: http://localhost:4173
- Backend API: http://localhost:3001
- Health check: `GET /health`

### Environment Configuration

The Docker Compose setup includes all necessary environment variables. If you need to customize them:

1. Copy `.env.example` to `.env`
2. Adjust values as needed
3. Restart the containers

### Database Setup

The database is automatically created and seeded when the backend container starts. The seed strategy is optimized for 10,000 employees using batched `insert_all` writes instead of row-by-row inserts.

### Render.com Deployment

For production deployment on Render.com, deploy the backend and frontend as separate services:

1. Create a PostgreSQL service in Render and note the connection string
2. Rename or create the Rails backend Web Service as `salary-management-assessment-api` so the frontend can use the default `salary-management-assessment.onrender.com` URL
3. Set the following backend environment variables in Render:
   - `DATABASE_URL` (from Render PostgreSQL service)
   - `RAILS_ENV=production`
   - `RAILS_MASTER_KEY` (used to decrypt `backend/config/credentials.yml.enc`, which now stores `secret_key_base`)
   - `CORS_ORIGIN=https://salary-management-assessment.onrender.com`
4. Create the frontend as a separate Render static site using `render.yaml`; it will claim the default `salary-management-assessment.onrender.com` URL
5. Set the frontend build variable `VITE_API_URL` to the backend API URL (`https://salary-management-assessment-api.onrender.com`)

The backend will automatically run migrations on startup. Seeds are only run in development.

The frontend reads `VITE_API_URL` at build time, so it should point at the deployed backend API service.

## Notes

The seed strategy is optimized for 10,000 employees using batched `insert_all` writes instead of row-by-row inserts.
