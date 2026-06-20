# ADR 0001: Backend stack

## Status

Accepted

## Context

The project needs a backend that can serve the existing frontend, expose a simple health endpoint, and talk to PostgreSQL in a local Docker Compose setup.

## Decision

Use FastAPI for the HTTP API, Uvicorn as the ASGI server, asyncpg for PostgreSQL access, and Ruff for Python linting and formatting.

The backend runs in Docker, connects to PostgreSQL through the compose network, and exposes `GET /health` on port `8080` for local development.

## Consequences

- The backend stays lightweight and async end-to-end.
- Local development and CI can use the same containerized stack.
- Ruff provides both linting and formatting with a single toolchain.