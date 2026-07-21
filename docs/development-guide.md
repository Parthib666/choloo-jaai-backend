# Development Guide

## Prerequisites

Before running the backend, install:

* Node.js 22 LTS (or later)
* Docker Desktop
* Git
* PostgreSQL (optional when using Docker)
* pgAdmin (recommended)
* Postman (API testing)

---

# Development Workflow

Every feature follows the project's development workflow:

1. Plan the feature architecture
2. Implement the feature
3. Test using Postman
4. Update project documentation
5. Commit changes
6. Push to GitHub

---

# Technology Stack

| Layer            | Technology      |
| ---------------- | --------------- |
| Framework        | NestJS          |
| Language         | TypeScript      |
| Database         | PostgreSQL 16   |
| ORM              | TypeORM         |
| Authentication   | JWT + Passport  |
| Cache            | Redis (planned) |
| Containerization | Docker          |
| Validation       | class-validator |
| API Testing      | Postman         |

---

# Project Goal

The Choloo Jaai backend is designed as a scalable, secure, and modular REST API for event management. The architecture emphasizes maintainability, clean separation of concerns, and extensibility to support future modules such as bookings, ticketing, payments, and notifications.

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

Follow the steps below to start the development environment.

## 1. Start the Infrastructure

Start the PostgreSQL and Redis containers using Docker Compose.

```bash
docker compose up -d
```

## 2. Install Dependencies

Install all required Node.js packages.

```bash
npm install
```

## 3. Start the Development Server

Run the NestJS application in development mode with hot reloading.

```bash
npm run start:dev
```

The backend will be available at:

```text
http://localhost:3000
```

API base URL:

```text
http://localhost:3000/v1
```

---

# Useful Commands

| Command                | Description                                  |
| ---------------------- | -------------------------------------------- |
| `docker compose up -d` | Start PostgreSQL and Redis containers        |
| `docker compose down`  | Stop and remove Docker containers            |
| `npm install`          | Install project dependencies                 |
| `npm run start:dev`    | Start the development server with hot reload |
| `npm run build`        | Build the application for production         |
| `npm run start:prod`   | Run the production build                     |
| `npm run test`         | Execute unit tests                           |
| `npm run lint`         | Run ESLint to check code quality             |


---

# Implementation Status

## Completed

### Infrastructure

- Docker
- PostgreSQL 16
- Redis 7
- TypeORM
- JWT Authentication
- Environment-based configuration

### Modules

- Database Module
- Users Module
- Authentication Module
- Events Module

## In Progress

## Completed

### Infrastructure

- Docker
- PostgreSQL 16
- Redis 7 (Infrastructure Ready)
- TypeORM
- JWT Authentication
- Refresh Token Authentication
- Environment-based configuration

### Modules

- Database Module
- Users Module
- Authentication Module
- Events Module

## Planned

- Venue Module
- Booking Module
- Ticket Module
- Payment Module
- Notification Module

## Planned

- Venue Module
- Booking Module
- Ticket Module
- Payment Module
- Notification Module

---

# Module Implementation

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

* User registration
* User login
* Password hashing (bcrypt)
* JWT access token generation
* JWT refresh token generation
* Refresh token sessions
* Refresh token hashing (SHA-256)
* Refresh token rotation
* Logout
* Passport JWT Strategy
* JwtAuthGuard
* RolesGuard
* OptionalJwtAuthGuard
* Roles decorator
* CurrentUser decorator
* Environment-based JWT configuration

Current authentication flow:

```text
Client
   │
   ▼
AuthController
   │
   ▼
AuthService
   │
   ├── Register
   │      │
   │      ▼
   │   Hash Password
   │      │
   │      ▼
   │   UsersService
   │
   ├── Login
   │      │
   │      ▼
   │   Generate Access Token
   │      │
   │      ▼
   │   Create Refresh Session
   │      │
   │      ▼
   │   Store Refresh Token Hash
   │
   ├── Refresh
   │      │
   │      ▼
   │   Verify Refresh Token
   │      │
   │      ▼
   │   Rotate Refresh Token
   │
   └── Logout
          │
          ▼
     Revoke Session
```
---

## Events Module

Completed:

* Event entity
* Event repository
* Create Event endpoint
* Get All Events endpoint
* Get Event by ID endpoint
* Get Event by Slug endpoint
* Update Event endpoint
* CreateEventDto validation
* UpdateEventDto validation
* GetEventsQueryDto validation
* EventResponseDto
* Entity-to-response mapping
* Automatic slug generation
* Unique slug handling
* Event creator association
* Search
* Filtering
* Sorting
* Pagination
* Event update workflow
* Title-based slug regeneration
* Role-based update authorization
* JWT authentication
* Role-Based Access Control (ADMIN, EVENT_MANAGER)
* Event deletion endpoint
* Soft delete implementation
* DeleteDateColumn integration
* Admin-only delete authorization
* Published event deletion protection
* Cancelled event deletion workflow
* Deleted event filtering
* Delete event API validation
* OptionalJwtAuthGuard
* Soft delete
* Restore-ready architecture

Current event flow:

```text
Client
   │
   ▼
Optional JWT Authentication
   │
   ▼
EventsController
   │
   ▼
EventsService
   │
   ▼
Search / Filter / Sort / Pagination
   │
   ▼
PostgreSQL
```

---

# API Testing

Testing Tool

- Postman

---

## Authentication

Endpoints

- POST /v1/auth/register
- POST /v1/auth/login

Verified

- User registration
- User login
- Password hashing
- JWT access token generation
- JWT refresh token generation
- Refresh token rotation
- Logout
- Revoked token rejection
- Invalid refresh token rejection

---

## Users

Endpoints

- GET /v1/users

Verified

- Authentication
- User retrieval
- Response DTO mapping

---

## Events

Endpoints

Endpoints

- POST /v1/events
- GET /v1/events
- GET /v1/events/:id
- GET /v1/events/slug/:slug
- PATCH /v1/events/:id
- DELETE /v1/events/:id

Verified

Verified

- JWT Authentication
- Optional Authentication
- RBAC
- Event creation
- Event retrieval
- DTO validation
- Slug generation
- Search
- Filtering
- Sorting
- Pagination
- Event update
- Soft delete
- Published event protection
  
---

# Architecture Principles

The backend follows:

* Modular architecture
* Separation of concerns
* Repository pattern
* DTO-based validation
* Environment-based configuration
* Service-layer business logic
* Secure password handling
* Entity-to-response mapping
* JWT authentication
* Role-Based Access Control (RBAC)
* Automatic slug generation
* Session-based authentication
* Refresh token rotation
* Soft delete architecture
  
---

# Roadmap

## Phase 1 ✅ Completed

- Refresh Tokens
- Refresh Token Rotation
- Logout
- Token Refresh Endpoint

## Phase 2 ✅ Completed

- Event Listing
- Event Details
- Event Update
- Event Deletion
- Search
- Filtering
- Pagination
- Sorting
- Soft Delete

## Phase 3

- Venue Management
- Booking System
- Ticket Management
- Payment Integration

## Phase 4

- Notifications
- Swagger Documentation
- Rate Limiting
- Logging & Monitoring

---

# Last Updated

2026-07-21
