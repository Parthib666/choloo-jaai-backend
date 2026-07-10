# API Reference

## Base URL

Development

```text
http://localhost:3000
```

API Version

```text
v1
```

Current API Prefix

```text
http://localhost:3000/v1
```

## Request Headers

```http
Content-Type: application/json
```

---

# Users API

## Available Endpoints

| Method | Endpoint      | Description      |
| ------ | ------------- | ---------------- |
| GET    | /v1/users     | Get all users    |
| GET    | /v1/users/:id | Get a user by ID |
| PATCH  | /v1/users/:id | Update a user    |

---

## GET /v1/users

Returns all users.

### Response

Status:

```text
200 OK
```

Example:

```json
[
  {
    "id": "uuid",
    "firstName": "Parthib",
    "lastName": "Datta",
    "email": "parthib@test.com",
    "phone": "01700000000",
    "role": "CUSTOMER",
    "status": "ACTIVE"
  }
]
```

---

## GET /v1/users/:id

Returns a single user.

### Example

```http
GET /v1/users/be9d1ad9-760d-4e8b-ab86-f87b17f2ad49
```

### Success

```text
200 OK
```

Response:

```json
{
  "id": "be9d1ad9-760d-4e8b-ab86-f87b17f2ad49",
  "firstName": "Parthib",
  "lastName": "Datta",
  "email": "parthib@test.com",
  "phone": "01888888888",
  "role": "CUSTOMER",
  "status": "ACTIVE",
  "createdAt": "2026-07-10T16:36:11.992Z",
  "updatedAt": "2026-07-10T16:36:11.992Z"
}
```

### Not Found

```text
404 Not Found
```

Response:

```json
{
  "message": "User not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## PATCH /v1/users/:id

Updates an existing user.

### Example

```http
PATCH /v1/users/be9d1ad9-760d-4e8b-ab86-f87b17f2ad49
```

### Request

```json
{
  "phone": "01888888888"
}
```

### Success

```text
200 OK
```

Response:

```json
{
  "id": "be9d1ad9-760d-4e8b-ab86-f87b17f2ad49",
  "firstName": "Parthib",
  "lastName": "Datta",
  "email": "parthib@test.com",
  "phone": "01888888888",
  "role": "CUSTOMER",
  "status": "ACTIVE"
}
```

### Not Found

```text
404 Not Found
```

Response:

```json
{
  "message": "User not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

# Authentication API

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

```text
201 Created
```

Response:

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

```text
409 Conflict
```

Response:

```json
{
  "message": "Email already exists",
  "error": "Conflict",
  "statusCode": 409
}
```

### Notes

* Passwords are hashed using bcrypt.
* Plain passwords are never stored.
* Password hashes are never returned through the API.

---

# Current Limitations

Current implementation is intended for development.

Not yet implemented:

* Login authentication
* JWT access tokens
* Database-backed refresh tokens
* Role-based authorization
* Input sanitization
* Pagination
* Filtering
* Sorting
* Swagger documentation

---

# Last Updated

2026-07-11
