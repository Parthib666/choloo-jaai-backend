# Authentication Design

## Status

**Mostly Implemented**

The backend now supports secure user registration, JWT-based authentication, and role-based access control (RBAC). Additional security features such as refresh tokens are planned for future development.

---

# Authentication Strategy

The backend uses:

* JWT (JSON Web Tokens)
* bcrypt for password hashing
* Passport.js with JWT Strategy
* NestJS Guards for route protection
* Environment-based secret management

---

# Current Authentication Flow

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
Return UserResponseDto
```

---

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
Generate JWT Access Token
        │
        ▼
Return Access Token + User
```

---

```text
Authenticated Request
        │
Authorization: Bearer <JWT>
        │
        ▼
JwtAuthGuard
        │
        ▼
JwtStrategy
        │
Verify JWT Signature
        │
Check Token Expiration
        │
        ▼
Attach User to Request
        │
        ▼
Protected Controller
```

---

# Implemented Endpoints

| Method | Endpoint          | Purpose                | Status        |
| ------ | ----------------- | ---------------------- | ------------- |
| POST   | /v1/auth/register | Register a new account | ✅ Implemented |
| POST   | /v1/auth/login    | Authenticate user      | ✅ Implemented |

---

# Protected Routes

The backend currently supports protecting endpoints using:

```ts
@UseGuards(JwtAuthGuard)
```

Requests to protected endpoints require:

```http
Authorization: Bearer <access_token>
```

---

# JWT Payload

Generated access tokens contain:

| Field | Description          |
| ----- | -------------------- |
| sub   | User ID              |
| email | User email           |
| role  | User role            |
| iat   | Issued at timestamp  |
| exp   | Expiration timestamp |

---

# Implemented Security Features

| Feature                          | Status        |
| -------------------------------- | ------------- |
| Role-Based Access Control (RBAC) | ✅ Implemented |
| Roles Guard                      | ✅ Implemented |
| @Roles Decorator                 | ✅ Implemented |
| @CurrentUser Decorator           | ✅ Implemented |
| JWT Access Token Generation      | ✅ Implemented |
| Password Hashing (bcrypt)        | ✅ Implemented |

---

# Planned Features

| Feature                          | Status    |
| -------------------------------- | --------- |
| Refresh Tokens                   | ⏳ Planned |
| Database-backed Refresh Tokens   | ⏳ Planned |
| Logout Endpoint                  | ⏳ Planned |
| Refresh Token Rotation           | ⏳ Planned |
| Permissions System               | ⏳ Planned |

---

# Authentication Configuration

JWT configuration is loaded from environment variables.

Example:

```env
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
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

2026-07-15
