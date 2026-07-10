# Users API
## Available Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /v1/users | Get all users |
| GET | /v1/users/:id | Get a user by ID |
| POST | /v1/users | Create a user |
| PATCH | /v1/users/:id | Update a user |

## Base URL

Development

```
http://localhost:3000
```

API Version

```
v1
```

Current API prefix

```
http://localhost:3000/v1
```
## Request Headers

```
Content-Type: application/json
```

---

## GET /v1/users

Returns all users.

### Response

Status:

```
200 OK
```

Example:

```json
[
  {
    "id": "uuid",
    "firstName": "Parthib",
    "lastName": "Datta",
    "email": "parthib@test.com"
  }
]
```

---

## GET /v1/users/:id

Returns a single user.

### Example

```
GET /v1/users/be9d1ad9-760d-4e8b-ab86-f87b17f2ad49
```

### Success

```
200 OK
```

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

```
404 Not Found
```

```json
{
  "message": "User not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## POST /v1/users

Creates a new user.

### Request

```json
{
  "firstName": "Parthib",
  "lastName": "Datta",
  "email": "parthib@test.com",
  "phone": "01700000000",
  "passwordHash": "temporary_hash"
}
```

### Success

```
201 Created
```

### Duplicate Email

```
409 Conflict
```

```json
{
  "message": "Email already exists",
  "error": "Conflict",
  "statusCode": 409
}
```

---

## PATCH /v1/users/:id

Updates an existing user.

### Example

```
PATCH /users/be9d1ad9-760d-4e8b-ab86-f87b17f2ad49
```

### Request

```json
{
  "phone": "01888888888"
}
```

### Success

```
200 OK
```

Returns the updated user.

### Not Found

```
404 Not Found
```

```json
{
  "message": "User not found",
  "error": "Not Found",
  "statusCode": 404
}
```
## Known Limitations

Current implementation is intended for development only.

Not yet implemented:

- Password hashing
- Authentication
- Authorization
- Input sanitization
- Pagination
- Filtering
- Sorting
- Swagger documentation
---
---
## Last Updated

2026-07-10