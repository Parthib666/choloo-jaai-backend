# Development Guide
## Prerequisites

Before running the backend, install:

- Node.js (LTS)
- Docker Desktop
- Git
- PostgreSQL (optional when using Docker)
- Postman (API testing)

## Development Workflow

Every feature is developed using the following workflow:

1. Plan the architecture
2. Implement the feature
3. Test using Postman
4. Update documentation
5. Commit changes
6. Push to GitHub

---

## Git Workflow

Backend changes follow this process:

```
Feature Implementation
        │
        ▼
git add .
        │
        ▼
git commit
        │
        ▼
git push
```

Documentation is maintained alongside the code to ensure the backend and documentation repositories remain synchronized.

---
## Running the Backend

Start the infrastructure:

```bash
docker compose up -d
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run start:dev
```

The backend will be available at:

```
http://localhost:3000
```
# Current Backend Progress

## Infrastructure

Completed:

- Docker
- PostgreSQL 16
- Redis 7
- TypeORM
- Environment configuration

---

## Completed Modules

### Database Module

Completed:

- PostgreSQL connection
- TypeORM configuration
- Environment-based configuration

### Users Module

Completed:

- User entity
- Repository pattern
- DTO validation
- Create user
- Get all users
- Get user by ID
- Update user
- Duplicate email validation
- HTTP exception handling

---

## API Testing

Testing tool:

- Postman

Verified endpoints:

- GET /v1/users
- GET /v1/users/:id
- POST /v1/users
- PATCH /v1/users/:id

Verified features:

- User creation
- User retrieval
- User update
- DTO validation
- Duplicate email handling
- PostgreSQL persistence

---

## Next Steps

- Complete DELETE /users/:id
- Implement password hashing (bcrypt)
- Build Authentication module
- JWT authentication
- Role-Based Access Control (RBAC)