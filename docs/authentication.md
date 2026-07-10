# Authentication Design

## Status

**Planned**

Authentication has not yet been implemented.

---

## Authentication Strategy

The backend will use:

- JWT (JSON Web Tokens)
- bcrypt for password hashing
- Access Tokens
- Refresh Tokens
- Role-Based Access Control (RBAC)

---

## Planned Authentication Flow

```
User Login
     │
     ▼
Email + Password
     │
     ▼
bcrypt Password Verification
     │
     ▼
Generate Access Token
     │
     ▼
Generate Refresh Token
     │
     ▼
Authenticated Requests
```

---

## Planned User Roles

| Role | Description |
|------|-------------|
| CUSTOMER | Platform customer |
| CORPORATE_CLIENT | Corporate event client |
| EVENT_MANAGER | Event organizer and manager |
| ADMIN | System administrator |

---

## Planned Endpoints

| Method | Endpoint | Purpose |
|---------|----------|---------|
| POST | /v1/auth/register | Register a new account |
| POST | /v1/auth/login | Authenticate user |
| POST | /v1/auth/refresh | Refresh access token |
| POST | /v1/auth/logout | Logout user |

---

## Security Goals

The authentication system will provide:

- Secure password hashing using bcrypt
- Stateless authentication with JWT
- Refresh token support
- Protected routes using NestJS Guards
- Role-based authorization
- Secure environment-based secret management

---

## Implementation Status

| Feature | Status |
|---------|--------|
| Password Hashing | ⏳ Planned |
| JWT Authentication | ⏳ Planned |
| Refresh Tokens | ⏳ Planned |
| Authorization Guards | ⏳ Planned |
| Role-Based Access Control | ⏳ Planned |