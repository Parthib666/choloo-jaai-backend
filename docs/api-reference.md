# API Reference

## Base URL

Development

``` text
http://localhost:3000
```

## API Version

``` text
v1
```

## Current API Prefix

``` text
http://localhost:3000/v1
```

## Request Headers

``` http
Content-Type: application/json
```

------------------------------------------------------------------------

# Authentication

The API uses JWT Bearer authentication for protected endpoints.

## Authentication Flow

``` text
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

``` http
Authorization: Bearer <access_token>
```

Public endpoints:

  Method   Endpoint
  -------- -------------------
  POST     /v1/auth/register
  POST     /v1/auth/login

Protected endpoints:

  Method   Endpoint
  -------- -----------
  GET      /v1/users

------------------------------------------------------------------------

# Authentication API

## Available Endpoints

  Method   Endpoint            Description
  -------- ------------------- ------------------------
  POST     /v1/auth/register   Register a new account
  POST     /v1/auth/login      Authenticate a user

## POST /v1/auth/register

Creates a new user account.

### Request

``` json
{
  "firstName": "Parthib",
  "lastName": "Datta",
  "email": "parthib@test.com",
  "phone": "01700000000",
  "password": "MyPassword123!"
}
```

### Success

`201 Created`

``` json
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

`409 Conflict`

``` json
{
  "message": "Email already exists",
  "error": "Conflict",
  "statusCode": 409
}
```

## POST /v1/auth/login

Authenticates an existing user.

### Request

``` json
{
  "email": "parthib@test.com",
  "password": "MyPassword123!"
}
```

### Success

`200 OK`

``` json
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

`401 Unauthorized`

``` json
{
  "message": "Invalid email or password",
  "error": "Unauthorized",
  "statusCode": 401
}
```

------------------------------------------------------------------------

# Users API

## Available Endpoints

  Method   Endpoint        Description      Auth
  -------- --------------- ---------------- ----------
  GET      /v1/users       Get all users    Required
  GET      /v1/users/:id   Get user by ID   Public
  PATCH    /v1/users/:id   Update user      Public

## GET /v1/users

Requires:

``` http
Authorization: Bearer <access_token>
```

Success: `200 OK`

## GET /v1/users/:id

Success: `200 OK`

Not Found: `404 Not Found`

## PATCH /v1/users/:id

Updates an existing user.

Success: `200 OK`

Not Found: `404 Not Found`

------------------------------------------------------------------------

# Notes

-   Passwords are hashed using bcrypt.
-   Plain-text passwords are never stored.
-   Password hashes are never returned by the API.
-   JWT access tokens expire according to `JWT_EXPIRES_IN`.

------------------------------------------------------------------------

# Current Limitations

-   Refresh tokens
-   Logout endpoint
-   Role-Based Access Control (RBAC)
-   Roles Guard
-   Pagination
-   Filtering
-   Sorting
-   Swagger / OpenAPI

------------------------------------------------------------------------

# Last Updated

2026-07-14
