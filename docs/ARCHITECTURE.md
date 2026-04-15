# Architecture Overview

## Goals

- Build a production-quality salary management tool for HR managers.
- Keep the backend simple, testable, and fast enough for 10,000 employees.
- Separate server state from UI state on the frontend.
- Favor clarity and maintainability over unnecessary platform complexity.

## Backend

### Rails API-only

Rails is used in API-only mode to keep the backend focused on data access, business rules, and JSON endpoints.

### PostgreSQL

PostgreSQL is a strong fit for this assessment because it provides:

- Relational integrity for employees and salary histories
- Fast filtering and aggregation for insights
- Full-text search with GIN indexes

### Search strategy

PostgreSQL full-text search is used instead of Elasticsearch.

Why:

- The dataset size is small enough that Elasticsearch would be unnecessary overhead.
- Deployment and local development stay simpler.
- The solution still demonstrates indexed search and query design.

### Service objects

Business logic is kept in service objects:

- `EmployeeInsightService` for aggregations and summary metrics
- `EmployeeSearchService` for search and filtering

This keeps controllers thin and makes unit testing straightforward.

The backend code also uses concise inline comments in the controller, service, and model layers where they explain why a block exists, especially around search, pagination, and SQL aggregation.

## Frontend

### React + TypeScript + Vite

The UI is implemented as a modern SPA with a fast build and strong type safety.

The frontend is covered by Vitest and React Testing Library tests for the app shell, employee form, table, store, API helpers, and salary insight views.

### State management

- React Query manages server state, caching, and invalidation
- Zustand manages local UI state such as modal visibility and selected employee

### UX choices

- TailwindCSS for fast, consistent styling
- Framer Motion for motion polish and animated feedback
- Virtualized tables for handling large employee lists smoothly

## Data model

### Employees

Stores core HR attributes like name, title, country, salary, employment type, and status.

### Salary histories

Tracks historical salary changes for auditability and future insights.

## Performance strategy

- Bulk seed inserts using `insert_all`
- Batching to keep memory usage predictable
- Indexed search and filtered queries
- Pagination and virtualized rendering in the UI
