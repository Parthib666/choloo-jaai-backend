# API Reference

## Base URL

Development

```text
http://localhost:3000
```

## API Version

```text
v1
```

## Current API Prefix

```text
http://localhost:3000/v1
```

## Request Headers

```http
Content-Type: application/json
```

---

# Authentication

The API uses JWT Bearer authentication for protected endpoints.

## Authentication Flow

```text
Register
   │
   ▼
POST /v1/auth/register
   │
   ▼
Create Account
   │
   ▼
POST /v1/auth/login
   │
   ▼
Receive JWT Access Token
   │
   ▼
Authorization: Bearer <access_token>
   │
   ▼
Access Protected Endpoints
```

## Authorization Header

```http
Authorization: Bearer <access_token>
```

## Public Endpoints

| Method | Endpoint          |
| ------ | ----------------- |
| POST   | /v1/auth/register |
| POST   | /v1/auth/login    |

## Protected Endpoints

| Method | Endpoint   | Required Roles       |
| ------ | ---------- | -------------------- |
| GET    | /v1/users  | Authenticated        |
| POST   | /v1/events | ADMIN, EVENT_MANAGER |

---

# Authentication API

## Available Endpoints

| Method | Endpoint          | Description            |
| ------ | ----------------- | ---------------------- |
| POST   | /v1/auth/register | Register a new account |
| POST   | /v1/auth/login    | Authenticate a user    |

## POST /v1/auth/register

Creates a new user account.

### Request

```json
{
  "firstName": "Parthib",
  "lastName": "Datta",
  "email": "parthib@test.com",
  "phone": "01700000000",
  "password": "MyPassword123!"
}
```

### Success

**201 Created**

```json
{
  "id": "uuid",
  "firstName": "Parthib",
  "lastName": "Datta",
  "email": "parthib@test.com",
  "phone": "01700000000",
  "role": "CUSTOMER",
  "status": "ACTIVE",
  "createdAt": "2026-07-10T16:36:11.992Z",
  "updatedAt": "2026-07-10T16:36:11.992Z"
}
```

### Duplicate Email

**409 Conflict**

```json
{
  "message": "Email already exists",
  "error": "Conflict",
  "statusCode": 409
}
```

## POST /v1/auth/login

Authenticates an existing user.

### Request

```json
{
  "email": "parthib1@test.com",
  "password": "MyPassword123!"
}
```

### Success

**200 OK**

```json
{
  "accessToken": "<jwt_access_token>",
  "user": {
    "id": "uuid",
    "firstName": "Parthib",
    "lastName": "Datta",
    "email": "parthib@test.com",
    "phone": "01700000000",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "createdAt": "2026-07-10T16:36:11.992Z",
    "updatedAt": "2026-07-10T16:36:11.992Z"
  }
}
```

### Invalid Credentials

**401 Unauthorized**

```json
{
  "message": "Invalid email or password",
  "error": "Unauthorized",
  "statusCode": 401
}
```

---

# Users API

## Available Endpoints

| Method | Endpoint      | Description    | Authentication |
| ------ | ------------- | -------------- | -------------- |
| GET    | /v1/users     | Get all users  | Required       |
| GET    | /v1/users/:id | Get user by ID | Public         |
| PATCH  | /v1/users/:id | Update user    | Public         |

## GET /v1/users

Requires:

```http
Authorization: Bearer <access_token>
```

Success: **200 OK**

## GET /v1/users/:id

Success: **200 OK**

Not Found: **404 Not Found**

## PATCH /v1/users/:id

Updates an existing user.

Success: **200 OK**

Not Found: **404 Not Found**

-------------------------------------------------------------------------------------------------------------------------------

# Events API

## Available Endpoints

| Method | Endpoint   | Description        | Authentication        |
| ------ | ---------- | ------------------ | --------------------- |
| POST   | /v1/events | Create a new event | ADMIN / EVENT_MANAGER |

## POST /v1/events

Creates a new event.

### Authentication

Required

```http
Authorization: Bearer <access_token>
```

### Authorization

Allowed roles:

* ADMIN
* EVENT_MANAGER

### Request

```json
{
  "title": "Dhaka Metal Fest 2026",
  "description": "Bangladesh's biggest metal festival.",
  "category": "CONCERT",
  "venue": "Army Stadium",
  "address": "Dhaka Cantonment",
  "city": "Dhaka",
  "eventDate": "2026-12-20T18:00:00.000Z",
  "audienceCapacity": 10000,
  "ticketPrice": 500,
  "bannerImageUrl": "https://example.com/banner.jpg"
}
```

### Success

**201 Created**

```json
{
  "id": "uuid",
  "title": "Dhaka Metal Fest 2026",
  "slug": "dhaka-metal-fest-2026",
  "description": "Bangladesh's biggest metal festival.",
  "category": "CONCERT",
  "venue": "Army Stadium",
  "address": "Dhaka Cantonment",
  "city": "Dhaka",
  "eventDate": "2026-12-20T18:00:00.000Z",
  "audienceCapacity": 10000,
  "ticketPrice": 500,
  "bannerImageUrl": "https://example.com/banner.jpg",
  "status": "DRAFT",
  "createdAt": "2026-07-15T05:15:00.000Z",
  "updatedAt": "2026-07-15T05:15:00.000Z"
}
```

### Error Responses

| Status | Description           |
| ------ | --------------------- |
| 400    | Validation failed     |
| 401    | Unauthorized          |
| 403    | Forbidden             |
| 404    | User not found        |
| 500    | Internal server error |

### Business Rules

* Only `ADMIN` and `EVENT_MANAGER` users can create events.
* Event slugs are generated automatically from the title.
* Duplicate titles generate unique slugs by appending incremental suffixes (`-2`, `-3`, ...).
* Newly created events are assigned the `DRAFT` status.
* The authenticated user is recorded as the event creator (`createdBy`).
* Request validation is performed before database persistence.

### Testing Status

| Test                      | Result   |
| ------------------------- | -------- |
| Unauthorized (401)        | ✅ Passed |
| RBAC (403)                | ✅ Passed |
| Successful Creation (201) | ✅ Passed |
| Duplicate Slug            | ✅ Passed |
| Validation                | ✅ Passed |

---

# Notes

* Passwords are hashed using bcrypt.
* Plain-text passwords are never stored.
* Password hashes are never returned by the API.
* JWT access tokens expire according to `JWT_EXPIRES_IN`.
* Protected endpoints use JWT authentication.
* Role-based access control (RBAC) is enforced where applicable.

---

# Current Limitations

* Refresh tokens
* Logout endpoint
* Pagination
* Filtering
* Sorting
* Swagger / OpenAPI

---

# Last Updated

2026-07-15
