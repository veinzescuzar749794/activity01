# Activity 01 React Client

React + Vite frontend for the accompanying Spring Boot API.

## Run locally

1. From the repository root, run `cd backend` and start Spring Boot with `./mvnw.cmd spring-boot:run`.
2. In this folder run `npm install` and then `npm run dev`.
3. Open the URL printed by Vite (normally `http://localhost:5173`). The Vite proxy forwards `/api/*` to the Spring Boot application.

To call a separately hosted API, create `.env.local` with `VITE_API_BASE_URL=http://your-host:8080/api`. That backend must allow the frontend origin with CORS.

The UI never places a password in browser storage or renders it back to the user. It is retained only in the controlled password input while the request is being submitted.
