# ADR-001: Stack Decisions

## Status

Accepted

## Context

The assessment requires a complete salary management tool for an organization with 10,000 employees. The solution must be practical, production-oriented, testable, and easy to deploy.

## Decision

Use the following stack:

- Backend: Rails 8.1 API-only
- Database: PostgreSQL 16
- Search: PostgreSQL full-text search with GIN indexing
- Frontend: React 18 + TypeScript + Vite
- Styling: TailwindCSS
- Motion: Framer Motion
- Server state: React Query
- UI state: Zustand
- Tests: RSpec + React Testing Library/Vitest

## Rationale

| Decision | Why | Tradeoff |
| --- | --- | --- |
| Rails API-only | Mature conventions, fast development, strong testing support | Less built-in UI convenience |
| PostgreSQL FTS | Sufficient for 10k records, easy to deploy, indexed search | Less specialized than Elasticsearch |
| React Query | Clean server-state caching and invalidation | Requires discipline to avoid duplicating state |
| Zustand | Lightweight local UI state | Not a full application data layer |
| TailwindCSS + Framer Motion | Fast, expressive UI iteration with polished transitions | Some style repetition |

## Consequences

This stack keeps the solution focused, deployable, and aligned with the problem size while still showing strong product and engineering judgment.
