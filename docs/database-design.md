# Database Design

## Database

The Choloo Jaai backend uses **PostgreSQL 16** as its primary relational database.

### ORM

* TypeORM

---

# Current Tables

## users

### Purpose

Stores all platform users, including:

* Customers
* Corporate Clients
* Event Managers
* Administrators

### Schema

| Column       | Type      | Constraint       |
| ------------ | --------- | ---------------- |
| id           | UUID      | Primary Key      |
| firstName    | varchar   | Required         |
| lastName     | varchar   | Required         |
| email        | varchar   | Unique           |
| phone        | varchar   | Nullable         |
| passwordHash | varchar   | Required         |
| role         | enum      | Default CUSTOMER |
| status       | enum      | Default ACTIVE   |
| createdAt    | timestamp | Auto-generated   |
| updatedAt    | timestamp | Auto-generated   |

---

## refresh_tokens

### Purpose

Stores authenticated user sessions using hashed refresh tokens.

The table enables:

* Secure refresh token rotation
* Session-based authentication
* Logout from individual devices
* Logout from all devices (future)
* Detection of revoked refresh tokens

### Schema

| Column | Type | Constraint |
|---------|------|------------|
| id | UUID | Primary Key |
| tokenHash | varchar(64) | Unique |
| expiresAt | timestamp | Required |
| revokedAt | timestamp | Nullable |
| userId | UUID | Foreign Key → users.id |
| createdAt | timestamp | Auto-generated |

### Security

* Raw refresh tokens are **never stored**.
* Only SHA-256 hashes are stored.
* Each database row represents one authenticated session.
* Refresh token rotation updates the stored hash after every successful refresh.
* Logout revokes the session by setting `revokedAt`.

---

## events

### Purpose

Stores all events created and managed through the platform.

Supported event categories include:

* Concerts
* Seminars
* Conferences
* Corporate Events
* Workshops
* Festivals
* Other event types

### Schema

| Column           | Type      | Constraint             |
| ---------------- | --------- | ---------------------- |
| id               | UUID      | Primary Key            |
| title            | varchar   | Required               |
| slug             | varchar   | Unique                 |
| description      | text      | Required               |
| category         | enum      | Required               |
| venue            | varchar   | Required               |
| address          | text      | Nullable               |
| city             | varchar   | Required               |
| eventDate        | timestamp | Required               |
| audienceCapacity | integer   | Required               |
| ticketPrice      | decimal   | Required               |
| bannerImageUrl   | varchar   | Nullable               |
| status           | enum      | Default DRAFT          |
| deletedAt        | timestamp | Nullable (Soft Delete) |
| createdById      | UUID      | Foreign Key → users.id |
| createdAt        | timestamp | Auto-generated         |
| updatedAt        | timestamp | Auto-generated         |

---

# Column Details

## passwordHash

The database stores password hashes generated using **bcrypt**.

### Rules

* Plain-text passwords are never stored.
* Password hashes are never exposed through API responses.
* Password verification is handled by the Authentication module.

---

## slug

The `slug` column stores an SEO-friendly identifier generated automatically from the event title.

### Rules

* Generated automatically during event creation.
* Enforced as unique by the database.
* Duplicate titles receive incremental numeric suffixes.

Example:

```text
dhaka-metal-fest-2026
dhaka-metal-fest-2026-2
dhaka-metal-fest-2026-3
```

---

## deletedAt

* The `deletedAt` column enables soft deletion of events.
* TypeORM's `@DeleteDateColumn()` is used to implement soft deletion. Records remain in the database, and normal repository queries automatically exclude soft-deleted events unless explicitly requested.

### Rules

* Deleted events remain stored in the database.
* Soft-deleted events are excluded from normal application queries.
* Soft deletion preserves historical records for auditing and future recovery.
* Published events cannot be deleted directly. They must first be cancelled.

---

# Enums

## UserRole

Available values:

* CUSTOMER
* CLIENT
* EVENT_MANAGER
* ADMIN

| Role          | Description                 |
| ------------- | --------------------------- |
| CUSTOMER      | Public platform user        |
| CLIENT        | Corporate event client      |
| EVENT_MANAGER | Event organizer and manager |
| ADMIN         | System administrator        |

---

## UserStatus

Available values:

* ACTIVE
* INACTIVE
* SUSPENDED

| Status    | Description                                                            |
| --------- | ---------------------------------------------------------------------- |
| ACTIVE    | User account is active and can access the platform.                    |
| INACTIVE  | User account is temporarily inactive.                                  |
| SUSPENDED | User account has been suspended and cannot access protected resources. |

---

## EventCategory

Available values:

* CONCERT
* SEMINAR
* CONFERENCE
* CORPORATE
* WORKSHOP
* FESTIVAL
* OTHER

| Category   | Description                                       |
| ---------- | ------------------------------------------------- |
| CONCERT    | Concerts, live music performances, and gigs       |
| SEMINAR    | Educational and professional seminars             |
| CONFERENCE | Conferences, summits, and conventions             |
| CORPORATE  | Corporate meetings, launches, and business events |
| WORKSHOP   | Training sessions and hands-on workshops          |
| FESTIVAL   | Cultural, music, food, and community festivals    |
| OTHER      | Events outside predefined categories              |

---

## EventStatus

Available values:

* DRAFT
* PUBLISHED
* CANCELLED
* COMPLETED

| Status    | Description                                                  |
| --------- | ------------------------------------------------------------ |
| DRAFT     | Event has been created but is not yet visible to the public. |
| PUBLISHED | Event is publicly available and can be viewed or booked.     |
| CANCELLED | Event has been cancelled and is no longer active.            |
| COMPLETED | Event has concluded successfully.                            |

---

# Constraints

## Email

The `email` column has a unique constraint to prevent duplicate user accounts.

Example:

```text
parthib@test.com
```

cannot exist more than once.

---

## Refresh Token Hash

The `tokenHash` column is protected by a unique constraint.

Rules:

* Raw refresh tokens are never stored.
* SHA-256 hashes are stored instead.
* Each session has exactly one token hash.

---

## Slug

The `slug` column has a unique constraint.

The application automatically generates a URL-friendly slug from the event title.

Duplicate titles receive incremental suffixes.

---

# Indexes

## refresh_tokens

| Column | Index Type | Purpose |
|---------|------------|---------|
| id | Primary Key | Session lookup |
| tokenHash | Unique B-tree | Refresh token validation |
| userId | B-tree | User session lookup |

## events

The `events` table contains indexes that optimize the application's most common query patterns.

| Column    | Index Type    | Purpose                                                                |
| --------- | ------------- | ---------------------------------------------------------------------- |
| id        | Primary Key   | Fast lookup by event ID.                                               |
| slug      | Unique B-tree | Fast lookup by event slug while enforcing uniqueness.                  |
| status    | B-tree        | Optimizes filtering by event status, especially public event listings. |
| category  | B-tree        | Optimizes filtering by event category.                                 |
| city      | B-tree        | Optimizes filtering by city.                                           |
| eventDate | B-tree        | Optimizes date filtering and chronological sorting of events.          |

### Design Notes

* Indexes are added only to frequently queried columns.
* Every additional index slightly increases INSERT, UPDATE, and DELETE costs because PostgreSQL must maintain the index.
* Composite indexes have intentionally not been introduced during Version 1. They will be considered after analyzing real-world query patterns and execution plans.
* PostgreSQL automatically determines whether an index should be used. For small tables, the query planner may choose a sequential scan because it is less expensive than traversing an index.

---

# Current Relationships

# Refresh Token Lifecycle

```text
Login
    │
    ▼
Create refresh token session
    │
    ▼
Generate refresh JWT
    │
    ▼
Hash token using SHA-256
    │
    ▼
Store hash in database
    │
    ▼
Return refresh token

Refresh
    │
    ▼
Verify JWT signature
    │
    ▼
Hash incoming token
    │
    ▼
Compare hash with database
    │
    ▼
Generate new access token
    │
    ▼
Generate new refresh token
    │
    ▼
Update stored hash

Logout
    │
    ▼
Hash incoming refresh token
    │
    ▼
Find matching session
    │
    ▼
Set revokedAt

```

## users → events

Relationship:

* One User can create many Events.
* Each Event belongs to one User.

Relationship Type:

**One-to-Many**

```text
users (1)
    │
    └────────────< events (*)
```

Foreign Key:

```text
events.createdById
      │
      ▼
users.id
```

---

## users → refresh_tokens

Relationship:

* One User can have multiple authenticated sessions.
* Each refresh token belongs to exactly one User.

Relationship Type:

**One-to-Many**

```text
users (1)
    │
    └────────────< refresh_tokens (*)
```

Foreign Key:

```text
refresh_tokens.userId
          │
          ▼
       users.id
```

---

# Planned Tables

Future planned relationships:

```text
users (1)
    │
    ├───────────< bookings
    └───────────< payments
```
Future planned tables

• bookings
• payments
---

# Entity Relationships

```text
User
├── id
├── firstName
├── lastName
├── email
├── role
│
├──────────────< Event
│                 ├── id
│                 ├── title
│                 ├── slug
│                 ├── status
│                 ├── deletedAt
│                 └── createdById (FK)
│
└──────────────< RefreshToken
                  ├── id
                  ├── tokenHash
                  ├── expiresAt
                  ├── revokedAt
                  └── userId (FK)
```

---

# Last Updated

2026-07-20
