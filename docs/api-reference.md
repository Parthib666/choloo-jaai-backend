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
Receive
 ┌───────────────┐
 │ Access Token  │
 │ Refresh Token │
 └───────────────┘
    │
    ├──────────────► Protected APIs
    │
    ▼
POST /v1/auth/refresh
    │
    ▼
New Access Token
New Refresh Token
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
| POST   | /v1/auth/refresh  |
| POST   | /v1/auth/logout   |

## Protected Endpoints

| Method | Endpoint   | Required Roles       |
| ------ | ---------- | -------------------- |
| GET    | /v1/users  | ADMIN        |
| POST   | /v1/events | ADMIN, EVENT_MANAGER |

---

# Authentication API

## Available Endpoints

| Method | Endpoint          | Description                       |
| ------ | ----------------- | ----------------------------------|
| POST   | /v1/auth/register | Register a new account            |
| POST   | /v1/auth/login    | Authenticate a user               |
| POST   | /v1/auth/refresh  | Refresh access token              |
| POST   | /v1/auth/logout   | Logout and revoke refresh session |
| GET    | /v1/auth/profile  | Get authenticated user            |

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
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    ...
  }
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
## POST /v1/auth/refresh

### Request

```JSON
{
  "refreshToken": "<refresh-token>"
}
```

### Sucess
```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Possible errors:

- Invalid refresh token
- Refresh token revoked
- Refresh token expired
- Refresh token not found

## POST /v1/auth/logout

### Reuest
```json
{
  "refreshToken": "<refresh-token>"
}
```

### Success

```json
{
  "message": "Logged out successfully."
}
```

### Errors:

- Invalid refresh token
- Refresh token revoked

## GET /v1/auth/profile

## Reuest

```text
Authorization: Bearer <access_token>
```

## Response
```json
{
  "sub": "...",
  "email": "...",
  "role": "ADMIN",
  "type": "access",
  "iat": 1784589695,
  "exp": 1784590595
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

| Method | Endpoint          | Description        | Authentication        |
| ------ | ----------------- | ------------------ | --------------------- |
| POST   | /v1/events        | Create a new event | ADMIN / EVENT_MANAGER |
| GET    | /v1/events        | Get all events     | Public                |
| GET    | /v1/events/:id    | Get event by ID    | Public                |
| GET    | /v1/events/slug/:slug | Get event by slug | Public             |
| PATCH  | /v1/events/:id    | Update event       | ADMIN / EVENT_MANAGER |
| DELETE | /v1/events/:id    | Delete event       | ADMIN                 |

## POST /v1/events

Creates a new event.
Returns a single event using its SEO-friendly slug.

Responses

- 200 OK
- 404 Not Found

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
* Access tokens are short-lived JWTs.
* Refresh tokens are stored as SHA-256 hashes in the database.
* Refresh tokens are rotated on every refresh request.
* Logout revokes the current refresh token session.
* Password hashes are never returned by the API.
* Protected endpoints use JWT authentication.
* Role-based access control (RBAC) is enforced where applicable.


### Get All Events

```http
GET /v1/events
```

Returns a paginated list of events.

Authentication:

- Public endpoint
- Customers and guests can view published events only.
- Administrators and event managers can view all events.

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Number of records per page (default: 10, max: 100) |
| search | string | Search by event title or description |
| category | EventCategory | Filter by category |
| city | string | Filter by city |
| date | YYYY-MM-DD | Filter by event date |
| sortBy | eventDate \| createdAt \| title | Sort field |
| order | asc \| desc | Sort order |

Response:

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

### Get Event by ID

```http
GET /v1/events/:id
```

Returns a single event by its UUID.

Responses

- 200 OK
- 400 Bad Request (invalid UUID)
- 404 Not Found

---

### Get Event by Slug

```http
GET /v1/events/slug/:slug
```

# Update Event

```http
PATCH /v1/events/:id
```

Updates an existing event.

## Authentication

* Required
* Allowed roles:

  * ADMIN
  * EVENT_MANAGER

## Editable Fields

| Field            | Type        | Description                              |
| ---------------- | ----------- | ---------------------------------------- |
| title            | string      | Updates event title and regenerates slug |
| description      | string      | Updates event description                |
| venue            | string      | Updates venue                            |
| address          | string      | Updates event address                    |
| city             | string      | Updates event city                       |
| eventDate        | datetime    | Updates event date and time              |
| audienceCapacity | number      | Updates audience capacity                |
| ticketPrice      | number      | Updates ticket price                     |
| bannerImageUrl   | string      | Updates banner image                     |
| status           | EventStatus | Updates event status                     |

## Restricted Fields

The following fields cannot be updated:

| Field     | Reason                                 |
| --------- | -------------------------------------- |
| id        | Immutable identifier                   |
| category  | Event classification cannot be changed |
| createdBy | Original ownership record              |
| createdAt | Creation timestamp                     |

## Business Rules

* If the title changes, the slug is automatically regenerated.
* Generated slugs remain unique.
* Published events can be updated.
* `updatedAt` is automatically updated by TypeORM.

## Request Example

```json
{
  "title": "Updated Event Name",
  "eventDate": "2027-01-15T18:00:00.000Z",
  "ticketPrice": 800,
  "status": "PUBLISHED"
}
```

## Responses

### 200 OK

Returns the updated event.

### 400 Bad Request

Returned for:

* Invalid UUID
* Validation errors
* Attempting to update restricted fields

### 401 Unauthorized

Returned when authentication is missing.

### 403 Forbidden

Returned when the user role is not ADMIN or EVENT_MANAGER.

### 404 Not Found

Returned when the event does not exist.

# Delete Event

```http
DELETE /v1/events/:id
```

Soft deletes an existing event.

## Authentication

* Required
* Allowed roles:

  * ADMIN

## Delete Behavior

* Uses soft delete.
* The event is not permanently removed from the database.
* Deleted events are hidden from normal event queries.
* The original record remains available for future auditing or recovery.

## Business Rules

* Only ADMIN users can delete events.
* DRAFT events can be deleted.
* CANCELLED events can be deleted.
* PUBLISHED events cannot be deleted.
* Published events must be cancelled first using the PATCH endpoint.

## Request Example

```http
DELETE /v1/events/4fbeb370-b1ea-4a93-a3f9-e6ab2dfa45f0
```

## Responses

### 200 OK

Event deleted successfully.

Example:

```json
{
  "message": "Event deleted successfully."
}
```

### 400 Bad Request

Returned when:

* Invalid UUID format is provided.

### 401 Unauthorized

Returned when:

* Authentication token is missing.

### 403 Forbidden

Returned when:

* User role is not ADMIN.
* Attempting to delete a PUBLISHED event.

Example:

```json
{
  "message": "Published events cannot be deleted. Cancel the event instead.",
  "error": "Forbidden",
  "statusCode": 403
}
```

### 404 Not Found

Returned when:

* Event does not exist.

---

# Current Limitations

* Swagger / OpenAPI

---

# Last Updated

2026-07-21
