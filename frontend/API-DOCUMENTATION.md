# API Data Contract

The frontend sends JSON using `fetch`. In local development it calls relative `/api` paths, which Vite proxies to `http://localhost:8080`.

## Register a user

- **Method and URL:** `POST /api/register` (local backend: `http://localhost:8080/api/register`)
- **Purpose:** creates a user when the username is not already in use.
- **Headers:** `Content-Type: application/json`; `Accept: application/json, text/plain`
- **Request body:** JSON object with `username` (`string`) and `password` (`string`).
- **Success:** `200 OK`; JSON user object, with `id` (`number`), `username` (`string`), and, in the current backend implementation, `password` (`string`). The client ignores the returned password.
- **Errors:** `400 Bad Request` with text `Username already exists`; connection failures are shown as a generic request error.

```json
POST /api/register
{
  "username": "alex",
  "password": "MyPassword123"
}
```

```json
200 OK
{
  "id": 1,
  "username": "alex",
  "password": "MyPassword123"
}
```

```text
400 Bad Request
Username already exists
```

## Log in

- **Method and URL:** `POST /api/login` (local backend: `http://localhost:8080/api/login`)
- **Purpose:** verifies the supplied username and password.
- **Headers:** `Content-Type: application/json`; `Accept: application/json, text/plain`
- **Request body:** JSON object with `username` (`string`) and `password` (`string`).
- **Success:** `200 OK` with text `Login successful`. The client redirects to the Dashboard and only keeps the username in React component state.
- **Errors:** `401 Unauthorized` with text `Invalid username or password`; connection failures are shown as a generic request error.

```json
POST /api/login
{
  "username": "alex",
  "password": "MyPassword123"
}
```

```text
200 OK
Login successful
```

```text
401 Unauthorized
Invalid username or password
```

## Client-side validation

Before either request, the client requires non-empty `username` and `password` fields. No request is sent when either validation error is present.

> Security note: this client never stores passwords. The supplied backend currently persists and returns passwords directly, which should be changed to salted password hashes and a response DTO before production use.
