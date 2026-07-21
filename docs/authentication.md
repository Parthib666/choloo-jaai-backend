# Authentication Design

## Status

**Mostly Implemented**

The backend currently supports:

* Secure user registration
* JWT-based authentication
* Access and refresh token authentication
* Refresh token rotation
* Database-backed refresh token sessions
* Role-Based Access Control (RBAC)

Additional security features such as password reset, email verification, and advanced session management are planned for future development.

---

# Authentication Strategy

The backend uses:

* JWT (JSON Web Tokens)
* Separate Access Token and Refresh Token strategy
* bcrypt for password hashing
* Passport.js with JWT Strategy
* NestJS Guards for route protection
* Environment-based secret management
* Database-backed refresh token sessions

---

# Authentication Flow

## User Registration

```text
User Registration
        │
        ▼
Validate Register DTO
        │
        ▼
Hash Password (bcrypt)
        │
        ▼
Store User in PostgreSQL
        │
        ▼
Return User Response
```

---

## User Login

```text
User Login
        │
        ▼
Validate Login DTO
        │
        ▼
Find User by Email
        │
        ▼
Compare Password (bcrypt)
        │
        ▼
Generate Access Token
        │
        ▼
Create Refresh Token Session
        │
        ▼
Generate Refresh Token
        │
        ▼
Hash Refresh Token
        │
        ▼
Store Token Hash in Database
        │
        ▼
Return Access Token + Refresh Token
```

---

## Authenticated Request

```text
Client Request
        │
        ▼
Authorization: Bearer <access_token>
        │
        ▼
JwtAuthGuard
        │
        ▼
JwtStrategy
        │
        ▼
Verify JWT Signature
        │
        ▼
Check Token Expiration
        │
        ▼
Attach User Payload to Request
        │
        ▼
Protected Controller
```

---

# Token Architecture

The system uses two different JWT tokens.

## Access Token

Purpose:

* Authenticate API requests
* Short-lived authorization token

Payload:

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "ADMIN",
  "type": "access"
}
```

Contains:

| Field | Description          |
| ----- | -------------------- |
| sub   | User ID              |
| email | User email           |
| role  | User role            |
| type  | Token type           |
| iat   | Issued timestamp     |
| exp   | Expiration timestamp |

---

## Refresh Token

Purpose:

* Generate new access tokens
* Maintain user sessions

Payload:

```json
{
  "sub": "user-id",
  "sessionId": "refresh-session-id",
  "type": "refresh"
}
```

Contains:

| Field     | Description                       |
| --------- | --------------------------------- |
| sub       | User ID                           |
| sessionId | Database refresh token session ID |
| type      | Token type                        |
| iat       | Issued timestamp                  |
| exp       | Expiration timestamp              |

---

# Refresh Token Management

Raw refresh tokens are never stored in the database.

The backend stores a SHA-256 hash:

```text
Refresh Token
        │
        ▼
SHA-256 Hash
        │
        ▼
Stored in PostgreSQL
```

Database entity:

```text
refresh_tokens

id
tokenHash
expiresAt
revokedAt
createdAt
userId
```

Relationship:

```text
User
 │
 │ 1:N
 │
RefreshToken
```

---

# Refresh Token Rotation

When a refresh request is received:

```text
Client sends Refresh Token
          │
          ▼
Verify Refresh JWT
          │
          ▼
Extract Session ID
          │
          ▼
Hash Provided Token
          │
          ▼
Find Matching Database Session
          │
          ▼
Check Expiration
          │
          ▼
Check Revocation Status
          │
          ▼
Generate New Access Token
          │
          ▼
Generate New Refresh Token
          │
          ▼
Replace Stored Token Hash
```

Old refresh tokens become invalid after rotation.

---

# Implemented Endpoints

| Method | Endpoint          | Purpose                 | Status        |
| ------ | ----------------- | ----------------------- | ------------- |
| POST   | /v1/auth/register | Register a new account  | ✅ Implemented |
| POST   | /v1/auth/login    | Authenticate user       | ✅ Implemented |
| POST   | /v1/auth/refresh  | Generate new token pair | ✅ Implemented |
| POST   | /v1/auth/logout   | Revoke refresh session  | ⏳ Pending     |

---

# Protected Routes

The backend supports protecting endpoints using:

```ts
@UseGuards(JwtAuthGuard)
```

Protected requests require:

```http
Authorization: Bearer <access_token>
```

---

# Role-Based Access Control (RBAC)

Authorization is implemented using:

## Roles Decorator

Example:

```ts
@Roles(
  UserRole.ADMIN,
  UserRole.EVENT_MANAGER
)
```

## Roles Guard

The guard verifies whether the authenticated user's role matches the required roles.

Example:

Allowed:

```text
ADMIN
EVENT_MANAGER
```

Denied:

```text
CUSTOMER
```

---

# Implemented Security Features

| Feature                          | Status        |
| -------------------------------- | ------------- |
| Role-Based Access Control (RBAC) | ✅ Implemented |
| Roles Guard                      | ✅ Implemented |
| @Roles Decorator                 | ✅ Implemented |
| @CurrentUser Decorator           | ✅ Implemented |
| JWT Access Token Generation      | ✅ Implemented |
| JWT Refresh Token Generation     | ✅ Implemented |
| Separate Access/Refresh Secrets  | ✅ Implemented |
| Password Hashing (bcrypt)        | ✅ Implemented |
| Refresh Token Hash Storage       | ✅ Implemented |
| Refresh Token Rotation           | ✅ Implemented |
| Database Refresh Sessions        | ✅ Implemented |

---

# Planned Features

| Feature                         | Status        |
| ------------------------------- | ------------- |
| Logout Endpoint                 | ⏳ In Progress |
| Password Reset                  | ⏳ Planned     |
| Email Verification              | ⏳ Planned     |
| Permission-Based Authorization  | ⏳ Planned     |
| Multi-device Session Management | ⏳ Planned     |
| OAuth Authentication            | ⏳ Planned     |

---

# Authentication Configuration

JWT configuration is loaded from environment variables.

Example:

```env
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
```

---

# Current Technology Stack

* NestJS Authentication
* Passport.js
* passport-jwt
* @nestjs/jwt
* bcrypt
* PostgreSQL
* TypeORM

---

# Last Updated

2026-07-21
