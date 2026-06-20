# Backend Documentation

## Technology Stack
- **Framework**: Python (FastAPI/Flask-like) with Uvicorn
- **Database**: PostgreSQL
- **Docker**: Docker Compose for development/deployment

## Architecture Overview
The backend follows a monolithic structure with:
1. **API Layer**: Exposes REST endpoints for:
   - Event management
   - SU member database
   - Authentication (JWT)
   - Admin dashboard
2. **Database Layer**: PostgreSQL storing:
   - User records
   - Event logs
   - Communication data
3. **Dependency Injection**: Environment variables for configuration

## Docker Compose Setup (Development)
```yaml
# docker-compose.yml
services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://su:su_dev_password@db:5432/su_portal
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      - POSTGRESDB=su_portal
      - PGUSER=su
      - PGPASSWORD=su_dev_password
```

## Environment Configuration (`.env.example`)
To run locally or in production:
1. Copy example to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Required environment variables:
   - `DATABASE_URL`: Database connection string (Docker uses DB service, local uses `localhost:5432`)
   - `ADMIN_PASSWORD`: Secure password for super-admin access
   - `JWT_SECRET`: Random string for JWT signing (128+ chars recommended)
   - `TOKEN_EXPIRE_HOURS`: JWT token lifespan (default: 7 days)
   - `CORS_ORIGINS`: Frontend URLs allowed to connect (e.g. `http://localhost:3000,https://su.fblrkus.ru`)
   - `DEBUG`: Set to `false` for production

## Local Development
```bash
# Install dependencies
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt -r requirements-dev.txt

# Run server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Production Deployment
1. Build Docker image:
   ```bash
   docker build -t swp-backend:latest .
   ```
2. Push to container registry
3. Deploy with:
   ```bash
   docker compose up -d
   ```
```

