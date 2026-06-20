```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt -r requirements-dev.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Before running the backend locally, copy [backend/.env.example](.env.example/) to `backend/.env` and adjust the secrets if needed. The backend expects PostgreSQL at `postgresql://su:su_dev_password@localhost:5432/su_portal` when running outside Docker.
