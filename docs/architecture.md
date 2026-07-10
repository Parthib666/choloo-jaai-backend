# Backend Architecture

## Overview

The Choloo Jaai backend is built using **NestJS**, following a modular architecture that promotes scalability, maintainability, and separation of concerns.

The application uses:

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- Redis
- Docker

---

## Project Structure

```
src/
├── common/          # Shared decorators, guards, filters, interceptors, utilities
├── config/          # Application configuration
├── database/        # Database module and TypeORM configuration
├── modules/         # Business modules
│   └── users/
├── app.module.ts
└── main.ts
```

---

## Architecture Layers

Each business module follows the same layered architecture.

```
HTTP Request
      │
      ▼
Controller
      │
      ▼
Service
      │
      ▼
TypeORM Repository
      │
      ▼
PostgreSQL
```

### Controller

Responsible for:

- Receiving HTTP requests
- Validating input
- Returning HTTP responses

### Service

Responsible for:

- Business logic
- Data validation
- Calling repositories

### Repository

Responsible for:

- Database operations
- Query execution through TypeORM

---

## Current Implemented Module

### Users Module

Implemented features:

- Create User
- Get All Users
- Get User by ID
- Update User
- Duplicate Email Validation

---

## Development Principles

The backend follows:

- Modular Architecture
- Separation of Concerns
- Repository Pattern
- DTO Validation
- Dependency Injection
- Environment-based Configuration