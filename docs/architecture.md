   # Backend Architecture

   ## Overview

   The Choloo Jaai backend is built using **NestJS**, following a modular architecture that promotes scalability, maintainability, and separation of concerns.

   The application uses:

   * NestJS
   * TypeScript
   * TypeORM
   * PostgreSQL
   * Redis (planned)
   * Docker

   ---

   # Project Structure

   ```
   src/
   ├── common/              # Shared decorators, guards, filters, interceptors, utilities
   ├── config/              # Application configuration
   ├── database/            # Database module and TypeORM configuration
   ├── modules/
   │   ├── auth/            # Authentication and authorization
   │   ├── users/           # User management
   │   └── events/          # Event management
   ├── app.module.ts
   └── main.ts
   ```

   ---

   # Architecture Layers

   Each business module follows a layered architecture.

   ```
   Client
      │
      ▼
   Global Validation
      │
      ▼
   Authentication Guards
      │
      ▼
   Authorization Guards
      │
      ▼
   Controller
      │
      ▼
   Service
      │
      ▼
   Repository
      │
      ▼
   PostgreSQL
   ```

   ---

   # Layer Responsibilities

   ## Controller

   Responsible for:

   * Receiving HTTP requests
   * Request routing
   * DTO validation handling
   * Returning HTTP responses

   ---

   ## Service

   Responsible for:

   * Business logic
   * Data processing
   * Validation rules
   * Coordinating repositories
   * Handling module operations

   ---

   ## Repository

   Responsible for:

   * Database operations
   * Entity persistence
   * Query execution through TypeORM

   ---

   ## DTO Layer

   DTOs define the structure of incoming and outgoing data.

   Responsibilities:

   * Validate incoming requests
   * Prevent invalid data
   * Control exposed API fields

   ---

   ## Mapper Layer

   The mapper layer converts database entities into API response objects.

   Purpose:

   * Prevent exposing sensitive fields
   * Separate database models from API responses

   Example:

   ```
   User Entity
      |
      ▼
   UserMapper
      |
      ▼
   UserResponseDto
   ```
# Security Layer

The backend secures protected resources using NestJS Guards and JWT authentication.

Implemented components:

* JwtStrategy
* JwtAuthGuard
* OptionalJwtAuthGuard
* RolesGuard
* @Roles decorator
* @CurrentUser decorator

Authentication flow:

Client
    │
Authorization: Bearer Token
    │
    ▼
JwtAuthGuard
    │
    ▼
JwtStrategy
    │
    ▼
Validate JWT
    │
    ▼
Attach User to Request
    │
    ▼
RolesGuard (optional)
    │
    ▼
Controller
   ---

   # Current Implemented Modules

   ## Database Module

   Implemented:

   * PostgreSQL connection
   * TypeORM configuration
   * Environment-based database configuration

   ---

   # Users Module

   The Users module manages user data operations.

   Implemented features:

   * User entity
   * Repository pattern
   * DTO validation
   * Create user
   * Get all users
   * Get user by ID
   * Update user
   * Duplicate email validation
   * HTTP exception handling
   * UserResponseDto
   * Entity-to-response mapping
   * Password hash protection

   Current flow:

   ```
   Controller
      |
      ▼
   UsersService
      |
      ▼
   UserRepository
      |
      ▼
   PostgreSQL users table
   ```

   ---

   # Authentication Module

   The Auth module handles authentication and authorization workflows.
   ```text
           auth/
         ├── dto/
         ├── entities/
         ├── guards/
         ├── interfaces/
         ├── strategies/
         ├── auth.controller.ts
         ├── auth.service.ts
         └── auth.module.ts

   ```

   Implemented features:

   Implemented features:

   * User registration
   * User login
   * JWT access token generation
   * JWT refresh token generation
   * Database-backed refresh token sessions
   * Refresh token hashing (SHA-256)
   * Refresh token rotation
   * Logout
   * Session revocation
   * JwtStrategy
   * JwtAuthGuard
   * RBAC
   * RolesGuard
   * @Roles decorator
   * @CurrentUser decorator

   Current authentication flow:

```
 Client
   │
   ▼
AuthController
   │
   ▼
AuthService
   │
   ├── Validate Credentials
   │
   ├── Generate Access Token
   │
   ├── Create Refresh Session
   │
   ├── Generate Refresh Token
   │
   ├── Hash Refresh Token
   │
   └── Store Session

Refresh

Client
   │
   ▼
Verify Refresh Token
   │
   ▼
Validate Session
   │
   ▼
Generate New Access Token
   │
   ▼
Rotate Refresh Token

Logout

Client
   │
   ▼
Verify Refresh Token
   │
   ▼
Locate Session
   │
   ▼
Revoke Session
```

   ---

   # Events Module

   The Events module manages event creation and future event lifecycle operations.

   Implemented features:

   * Create Event
   * Get All Events
   * Get Event by ID
   * Get Event by Slug
   * Update Event
   * Soft Delete Event
   * Automatic slug generation
   * Duplicate slug handling
   * Optional authentication for public listings
   * RBAC for management endpoints

   Current event creation flow:

   ```text
   Client
      |
      ▼
   JWT Authentication Guard
      |
      ▼
   Roles Guard
      |
      ▼
   EventsController
      |
      ▼
   EventsService
      |
      ▼
   Generate Unique Slug
      |
      ▼
   EventRepository
      |
      ▼
   PostgreSQL events table
   ```

   Planned:
   
   * Event publishing workflow

   ---
   # Modul Dependancy Diagram
   ```
   AppModule
│
├── DatabaseModule
│
├── UsersModule
│
├── AuthModule
│      │
│      └──── UsersModule
│
└── EventsModule
       │
       └──── UsersModule
       ```
   # API Architecture

   The backend uses versioned APIs.

   Current API prefix:

   ```
   /v1
   ```

   Example:

   ```
   POST    /v1/auth/register
   POST    /v1/auth/login
   POST /v1/auth/refresh
   POST /v1/auth/logout

   GET    /v1/auth/profile

   GET     /v1/users
   GET     /v1/users/:id
   GET    /v1/events/slug/:slug
   PATCH   /v1/users/:id
   POST    /v1/events
   DELETE /v1/events/:id


   ```

   ---

   # Development Principles

   The backend follows:

   * Modular Architecture
   * Separation of Concerns
   * Repository Pattern
   * DTO-based Validation
   * Entity-Response Separation
   * Dependency Injection
   * Environment-based Configuration
   * Secure Password Handling
   * JWT Authentication
   * Role-Based Access Control (RBAC)
   * Automatic Slug Generation
   * Session-based Authentication
   * Refresh Token Rotation
   * Soft Delete
   * Secure Token Hashing

---
   # Last Updated

   2026-07-15

