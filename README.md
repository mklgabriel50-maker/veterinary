# Vet Clinic (Fresh-start Railway monorepo)

This repo contains:
- **backend/**: FastAPI + SQLAlchemy + JWT Auth
- **frontend/**: React (Vite) + Nginx (runtime `API_URL` via `env.js`)
- **docker-compose.yml**: local development only

## 1) Run locally (Docker)
```bash
docker compose up --build
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:8000/docs  
- Healthcheck: http://localhost:8000/health

## 2) Deploy on Railway (recommended order)

### Step A — Create project
1. Create a new **GitHub repo** and push this project (root of repo contains `backend/` + `frontend/`).
2. Railway → **New Project** → **Deploy from GitHub Repo**

### Step B — Deploy backend
1. Add a service from the repo:
   - **Root Directory**: `backend`
2. Add plugin: **PostgreSQL**
3. Backend → **Variables**
   - `DATABASE_URL` = Postgres plugin `DATABASE_URL`
   - `JWT_SECRET` = random long string
   - `CORS_ORIGINS` = `*` (temporary; tighten after frontend deploy)
4. Backend → **Settings**
   - Healthcheck path: `/health`
5. Deploy and open:
   - `https://<backend-url>/health` (should return `{"status":"ok"}`)

### Step C — Deploy frontend
1. Add another service from the same repo:
   - **Root Directory**: `frontend`
2. Frontend → **Variables**
   - `API_URL` = backend public URL (example: `https://<backend>.up.railway.app`)
3. Deploy and open the frontend URL.

### Step D — Tighten CORS (after frontend is live)
Backend → Variables:
- `CORS_ORIGINS` = frontend public URL (example: `https://<frontend>.up.railway.app`)
Redeploy backend.

## Notes
- Railway injects `PORT` automatically. The frontend Nginx config in this repo listens on `${PORT}`.
