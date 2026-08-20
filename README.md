# Activity 01: Full-Stack User Authentication

This repository contains two separate applications:

- `backend/` — Spring Boot REST API, served at `http://localhost:8080`.
- `frontend/` — React + Vite client, served at `http://localhost:5173`.

## Run the backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

## Run the frontend

Open a second terminal from the repository root:

```powershell
cd frontend
npm install
npm run dev
```

The Vite development server proxies `/api` requests to the backend.
