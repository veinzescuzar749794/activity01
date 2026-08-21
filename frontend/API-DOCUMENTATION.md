# API Data Contract

This document describes the contract between the React frontend and Spring Boot backend.

## Base URL and transport


# API Data Contract

This document shows how the ReactJS frontend communicates with the Spring Boot backend.

## Base URL

The React application calls the backend through the `/api` base path. During development, Vite proxies requests to `http://localhost:8080`.

- **Frontend:** `http://localhost:5173`
- **Backend:** `http://localhost:8080`
- **Frontend API base URL:** `/api`

## Register a user

| Field | Value |
| --- | --- |
| HTTP method and URL | `POST /api/register` (development target: `http://localhost:8080/api/register`) |
| Purpose | Create a new user when the username is not already registered. |
| Request headers | `Content-Type: application/json`; `Accept: application/json, text/plain` |
| Request body | JSON object: `username` (`string`), `password` (`string`) |
| Success | `200 OK`, JSON object containing `id` (`number`), `username` (`string`), and `password` (`string`) |
| Error | `400 Bad Request`, plain text: `Username already exists` |
| Server error | `500 Internal Server Error` when an unexpected backend or database error occurs |

**Request:**

```json
{
  "username": "jane.doe",
  "password": "ExamplePassword123"
}
```

**Successful response (`200 OK`):**

```json
{
  "id": 1,
  "username": "jane.doe",
  "password": "ExamplePassword123"
}
```

The current backend returns the saved entity, including its password field. The React app deliberately ignores that response data and does not display or persist the password. In a production system, the backend should hash passwords and omit them from response objects.

**Error response (`400 Bad Request`):**

```text
Username already exists
```

## Log in a user

| Field | Value |
| --- | --- |
| HTTP method and URL | `POST /api/login` (development target: `http://localhost:8080/api/login`) |
| Purpose | Verify a username and password combination. |
| Request headers | `Content-Type: application/json`; `Accept: application/json, text/plain` |
| Request body | JSON object: `username` (`string`), `password` (`string`) |
| Success | `200 OK`, plain text: `Login successful` |
| Error | `401 Unauthorized`, plain text: `Invalid username or password` |
| Server error | `500 Internal Server Error` when an unexpected backend or database error occurs |

**Request:**

```json
{
  "username": "jane.doe",
  "password": "ExamplePassword123"
}
```

**Successful response (`200 OK`):**

```text
Login successful
```

**Error response (`401 Unauthorized`):**

```text
Invalid username or password
```

## Get a user

| Field | Value |
| --- | --- |
| HTTP method and URL | `GET /api/user/{i}` (development target: `http://localhost:8080/api/user/{i}`) |
| Purpose | Retrieve one user by database ID. |
| Path parameter | `i` (`number`): the user database ID |
| Request headers | `Accept: application/json` |
| Request body | None |
| Success | `200 OK`, JSON object containing the user |
| Error | `404 Not Found` when no user exists with the requested ID |
| Server error | `500 Internal Server Error` when an unexpected backend or database error occurs |

**Request:**

```http
GET /api/user/1 HTTP/1.1
Accept: application/json
```

**Successful response (`200 OK`):**

```json
{
  "id": 1,
  "username": "jane.doe",
  "password": "ExamplePassword123"
}
```

**Error response (`404 Not Found`):**

```text
No response body
```

## Frontend validation

Before registration or login, the React form requires non-empty `username` and `password` values. If validation fails, no request is sent. The frontend accepts both JSON and plain-text responses and displays non-success response messages to the user.

> Security note: the current backend stores and returns passwords directly. Before production deployment, use password hashing, request validation, response DTOs, and authentication tokens.
The frontend sends requests with `fetch` from `frontend/src/api.js`.

## Data types

### User request

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `username` | `string` | Yes | Username used to register or authenticate. |
| `password` | `string` | Yes | Password used to register or authenticate. |

### User response

| Field | Type | Description |
| --- | --- | --- |
| `id` | `number` | Database-generated user identifier. |
| `username` | `string` | Registered username. |
| `password` | `string` | Persisted password in the current implementation. This should be replaced with a salted hash and omitted from API responses before production. |

## Register a user

- **Method:** `POST`
- **Endpoint:** `/api/register`
- **Full local URL:** `http://localhost:8080/api/register`
- **Purpose:** creates a user if the username is not already registered.
- **Request headers:**
  - `Content-Type: application/json`
  - `Accept: application/json, text/plain`
- **Request body:** `User request` JSON object.
- **Success:** `200 OK`, `Content-Type: application/json`, containing the saved user.
- **Errors:**
  - `400 Bad Request`, `text/plain`: `Username already exists`
  - `500 Internal Server Error`: unexpected server or database failure

### Sample request

```http
POST /api/register HTTP/1.1
Content-Type: application/json
Accept: application/json, text/plain

{
  "username": "alex",
  "password": "MyPassword123"
}
```

### Sample success response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 1,
  "username": "alex",
  "password": "MyPassword123"
}
```

### Sample error response

```http
HTTP/1.1 400 Bad Request
Content-Type: text/plain

Username already exists
```

## Log in

- **Method:** `POST`
- **Endpoint:** `/api/login`
- **Full local URL:** `http://localhost:8080/api/login`
- **Purpose:** verifies that the username exists and the supplied password matches.
- **Request headers:**
  - `Content-Type: application/json`
  - `Accept: application/json, text/plain`
- **Request body:** `User request` JSON object.
- **Success:** `200 OK`, `text/plain`: `Login successful`
- **Errors:**
  - `401 Unauthorized`, `text/plain`: `Invalid username or password`
  - `500 Internal Server Error`: unexpected server or database failure

### Sample request

```http
POST /api/login HTTP/1.1
Content-Type: application/json
Accept: application/json, text/plain

{
  "username": "alex",
  "password": "MyPassword123"
}
```

### Sample success response

```http
HTTP/1.1 200 OK
Content-Type: text/plain

Login successful
```

### Sample error response

```http
HTTP/1.1 401 Unauthorized
Content-Type: text/plain

Invalid username or password
```

## Get a user

- **Method:** `GET`
- **Endpoint:** `/api/user/{i}`
- **Full local URL:** `http://localhost:8080/api/user/{i}`
- **Path parameter:** `i` (`number`), the user database ID.
- **Purpose:** retrieves one user by database ID.
- **Request headers:** `Accept: application/json` is recommended; no request body is required.
- **Success:** `200 OK`, `Content-Type: application/json`, containing the user.
- **Errors:**
  - `404 Not Found`: no user exists with the requested ID
  - `500 Internal Server Error`: unexpected server or database failure

### Sample request

```http
GET /api/user/1 HTTP/1.1
Accept: application/json
```

### Sample success response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 1,
  "username": "alex",
  "password": "MyPassword123"
}
```

### Sample not-found response



## Frontend validation and response handling

Before registration or login, the React form requires non-empty `username` and `password` values. If validation fails, no HTTP request is sent.

The client accepts both JSON and plain-text responses. Non-2xx responses are converted into displayed error messages. Successful registration clears the form; successful login opens the dashboard using the submitted username.


