# Tech Stack Architecture Decision Record (ADR)

## Technology Choices
- **backend**: Python 3.11 with FastAPI
- **database**: PostgreSQL 16
- **containerization**: Docker with Docker Compose
- **configuration**: Environment variables in .env files

## Rationale
- Python/FastAPI chosen for rapid development and type safety
- PostgreSQL selected for relational data modeling and ACID compliance
- Docker Compose for simplified service orchestration
- Environment variables for secure config management
