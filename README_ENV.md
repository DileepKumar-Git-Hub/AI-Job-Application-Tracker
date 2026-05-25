# Local development and deployment environments

This repository contains a Django backend and a Vite React frontend. The following files were added to make local development and reproducible environments easier:

- `docker-compose.yml` — run both backend and frontend with Docker.
- `backend/Dockerfile` — builds the Django backend image.
- `frontend/my-react-app/Dockerfile` — builds the React app and serves with nginx.
- `backend/job_tracker/requirements.txt` — Python dependencies.
- `backend/job_tracker/.env.example` — example env file. Copy to `.env`.

Quick start (requires Docker and Docker Compose):

```bash
# from repository root
docker compose build
docker compose up
```

The backend will be available at `http://localhost:8000` and the frontend at `http://localhost:3000`.

Notes:
- The project contains `backend/job_tracker/.env.example`. Copy it to `backend/job_tracker/.env` and update `SECRET_KEY` and other values for production.
- This repository is prepared for Vercel to deploy the frontend; backend requires a separate hosting provider (Heroku, Render, Railway, or a VPS).
