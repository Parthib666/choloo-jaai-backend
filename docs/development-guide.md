# Development Guide

## Prerequisites

Before running the backend, install:

* Node.js (LTS)
* Docker Desktop
* Git
* PostgreSQL (optional when using Docker)
* Postman (API testing)

---

# Development Workflow

Every feature is developed using the following workflow:

1. Plan the architecture
2. Implement the feature
3. Test using Postman
4. Update documentation
5. Commit changes
6. Push to GitHub

---

# Git Workflow

Backend changes follow this process:

```text
Feature Implementation
        |
        ▼
git add .
        |
        ▼
git commit
        |
        ▼
git push
```

Documentation is maintained alongside the code to ensure the backend implementation and documentation remain synchronized.

---

# Running the Backend

## Start Infrastructure

```bash
docker compose up -d
```

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run start:dev
```

Backend will be available at:

```text
http://localhost:3000
```

API prefix:

```text
http://localhost:3000/v1
```

---

# Current Backend Progress

## Infrastructure

Completed:

* Docker
* PostgreSQL 16
* Redis 7
* TypeORM
* Environment-based configuration

---

# Completed Modules

## Database Module

Completed:

* PostgreSQL connection
* TypeORM configuration
* Environment configuration
* Entity-based database design

---

## Users Module

Completed:

* User entity
* Repository pattern
* DTO validation
* User retrieval
* User update
* Email uniqueness validation
* HTTP exception handling
* User response DTO
* Entity-to-response mapping
* Password hash protection through response mapping

---

## Authentication Module

Completed:

- User registration
- Password hashing (bcrypt)
- User login
- JWT authentication
- Passport JWT Strategy
- JWT route protection
- Environment-based JWT configuration

Current registration flow:

```text
Client
  |
  ▼
Auth Controller
  |
  ▼
Auth Service
  |
  ▼
bcrypt password hashing
  |
  ▼
Users Service
  |
  ▼
PostgreSQL users table
```

---

# API Testing

Testing tool:

* Postman

Verified endpoints:

- POST /v1/auth/register
- POST /v1/auth/login

Verified features:

- Password hashing
- Password verification
- JWT generation
- Protected endpoints
- Bearer authentication
---

# Current Architecture Principles

The backend follows:

* Modular architecture
* Separation of concerns
* Repository pattern
* DTO-based validation
* Environment-based configuration
* Service-layer business logic
* Secure password handling

---

# Next Steps

Authentication:

* Implement login endpoint
* Generate JWT access tokens
* Implement database-backed refresh tokens
* Create JWT authentication strategy
* Implement authentication guards

Authorization:

* Implement Role-Based Access Control (RBAC)
* Add role guards
* Protect restricted routes

API Improvements:

* Add Swagger documentation
* Add pagination
* Add filtering
* Add sorting
* Add input sanitization

---

# Last Updated

2026-07-11
