   # Backend Architecture

   ## Overview

   The Choloo Jaai backend is built using **NestJS**, following a modular architecture that promotes scalability, maintainability, and separation of concerns.

   The application uses:

   * NestJS
   * TypeScript
   * TypeORM
   * PostgreSQL
   * Redis
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
   HTTP Request
         |
         ▼
   Controller
         |
         ▼
   Service
         |
         ▼
   Repository
         |
         ▼
   Database
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

   Implemented features:

   * Separate authentication module
   * User registration
   * Register DTO validation
   * bcrypt password hashing
   * Integration with UsersService
   * Secure user response handling
   * User login
   * JWT access token generation
   * JWT authentication strategy
   * JWT authentication guard
   * Role-Based Access Control (RBAC)
   * Roles guard
   * CurrentUser decorator
   * Roles decorator

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
   ├── Register
   │      │
   │      ▼
   │   bcrypt Password Hashing
   │      │
   │      ▼
   │   UsersService
   │      │
   │      ▼
   │   PostgreSQL
   │
   └── Login
          │
          ▼
   Validate Credentials
          │
          ▼
   Generate JWT Access Token

   ```

   Planned:

   * Database-backed refresh tokens
   * Logout
   * Token refresh endpoint

   ---

   # Events Module

   The Events module manages event creation and future event lifecycle operations.

   Implemented features:

   * Event entity
   * Event repository
   * Create Event endpoint
   * CreateEventDto validation
   * EventResponseDto
   * Entity-to-response mapping
   * Automatic slug generation
   * Unique slug handling
   * Event creator association
   * JWT authentication
   * Role-Based Access Control (ADMIN, EVENT_MANAGER)

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

   * Get all events
   * Get event by slug
   * Update event
   * Delete event
   * Event publishing workflow

   ---

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

   GET     /v1/users
   GET     /v1/users/:id
   PATCH   /v1/users/:id

   POST    /v1/events
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

---
   # Last Updated

   2026-07-15

