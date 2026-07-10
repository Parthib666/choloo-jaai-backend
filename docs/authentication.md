# Authentication Design

## Status

**In Progress**

The authentication module has been created.

Currently implemented:

* User registration
* Password hashing using bcrypt
* Integration with Users module
* Secure password storage

Pending:

* Login authentication
* JWT access tokens
* Database-backed refresh tokens
* Authorization system

---

# Authentication Strategy

The backend will use:

* JWT (JSON Web Tokens)
* bcrypt for password hashing
* Access Tokens
* Database-backed Refresh Tokens
* Role-Based Access Control (RBAC)

---

# Current Authentication Flow

## User Registration

```
User Registration
        |
        ▼
Auth Controller
        |
        ▼
Auth Service
        |
        ▼
Validate Register DTO
        |
        ▼
Hash Password using bcrypt
        |
        ▼
Users Service
        |
        ▼
Store User in PostgreSQL
```

---

# Planned Login Flow

```
User Login
     |
     ▼
Email + Password
     |
     ▼
Find User
     |
     ▼
bcrypt Password Verification
     |
     ▼
Generate JWT Access Token
     |
     ▼
Generate Refresh Token
     |
     ▼
Authenticated Requests
```

---

# User Roles

| Role          | Description                 |
| ------------- | --------------------------- |
| CUSTOMER      | Public platform customer    |
| CLIENT        | Corporate event client      |
| EVENT_MANAGER | Event organizer and manager |
| ADMIN         | System administrator        |

---

# Available Endpoints

| Method | Endpoint          | Purpose                | Status      |
| ------ | ----------------- | ---------------------- | ----------- |
| POST   | /v1/auth/register | Register a new account | ✅ Completed |
| POST   | /v1/auth/login    | Authenticate user      | ⏳ Planned   |
| POST   | /v1/auth/refresh  | Refresh access token   | ⏳ Planned   |
| POST   | /v1/auth/logout   | Logout user            | ⏳ Planned   |

---

# Security Design

The authentication system will provide:

* Secure password hashing using bcrypt
* Password hashes never exposed through API responses
* JWT-based authentication
* Database-backed refresh token management
* Protected routes using NestJS Guards
* Role-based authorization
* Environment-based secret management

---

# Database-Backed Refresh Tokens

Refresh tokens will be stored in the database.

Purpose:

* Allow token revocation
* Support logout from all devices
* Track active sessions
* Improve security control

Implementation planned:

* Refresh token entity
* Token expiration handling
* Token rotation
* Logout invalidation

---

# Implementation Status

| Feature                          | Status      |
| -------------------------------- | ----------- |
| Separate Auth Module             | ✅ Completed |
| Register DTO                     | ✅ Completed |
| User Registration                | ✅ Completed |
| Password Hashing (bcrypt)        | ✅ Completed |
| Password Protection in Responses | ✅ Completed |
| JWT Authentication               | ⏳ Planned   |
| Access Tokens                    | ⏳ Planned   |
| Database-backed Refresh Tokens   | ⏳ Planned   |
| Authorization Guards             | ⏳ Planned   |
| Role-Based Access Control        | ⏳ Planned   |

---

# Last Updated

2026-07-11
