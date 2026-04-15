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

Copy `.env.example` to `.env` and adjust values as needed.

```bash
docker compose up --build
```

The app exposes:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health check: `GET /health`

## Notes

The seed strategy is optimized for 10,000 employees using batched `insert_all` writes instead of row-by-row inserts.
