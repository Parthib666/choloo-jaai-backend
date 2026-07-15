# Database Design

## Database

The backend uses **PostgreSQL 16** as the primary relational database.

ORM:

* TypeORM

---

# Current Tables

## users

### Purpose

Stores all platform users of the Choloo Jaai platform, including:

* Customers
* Clients
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
| address          | varchar   | Required               |
| city             | varchar   | Required               |
| eventDate        | timestamp | Required               |
| audienceCapacity | integer   | Required               |
| ticketPrice      | decimal   | Required               |
| bannerImageUrl   | varchar   | Nullable               |
| status           | enum      | Default DRAFT          |
| createdById      | UUID      | Foreign Key → users.id |
| createdAt        | timestamp | Auto-generated         |
| updatedAt        | timestamp | Auto-generated         |

---

# Column Details

## passwordHash

The database stores encrypted password hashes generated using bcrypt.

Rules:

* Plain-text passwords are never stored.
* Password hashes are never exposed through API responses.
* Password verification is handled by the Authentication module.

---

## slug

The `slug` column stores a URL-friendly identifier generated automatically from the event title.

Rules:

* Generated automatically during event creation.
* Enforced as unique by the database.
* Duplicate titles receive incremental numeric suffixes (for example, `dhaka-metal-fest-2026-2`).

---

# Enums

## UserRole

Available roles:

* CUSTOMER
* CLIENT
* EVENT_MANAGER
* ADMIN

### Description

| Role          | Description                 |
| ------------- | --------------------------- |
| CUSTOMER      | Public platform user        |
| CLIENT        | Corporate event client      |
| EVENT_MANAGER | Event organizer and manager |
| ADMIN         | System administrator        |

---

## UserStatus

Available statuses:

* ACTIVE
* INACTIVE
* SUSPENDED

### Description

| Status | Description |
|--------|-------------|
| ACTIVE | User account is active and can access the platform. |
| INACTIVE | User account is temporarily inactive. |
| SUSPENDED | User account has been suspended and cannot access protected resources. |

---

## EventCategory

Available categories:

* CONCERT
* SEMINAR
* CONFERENCE
* CORPORATE
* WORKSHOP
* FESTIVAL
* OTHER

### Description

| Category   | Description                                           |
| ---------- | ----------------------------------------------------- |
| CONCERT    | Concerts, live music performances, and gigs           |
| SEMINAR    | Educational and professional seminars                 |
| CONFERENCE | Conferences, summits, and conventions                 |
| CORPORATE  | Corporate meetings, launches, and business events     |
| WORKSHOP   | Training sessions, bootcamps, and hands-on workshops  |
| FESTIVAL   | Cultural, music, food, and community festivals        |
| OTHER      | Events that do not fit into the predefined categories |


---

## EventStatus

Available statuses:

* DRAFT
* PUBLISHED
* CANCELLED
* COMPLETED

### Description

| Status | Description |
|--------|-------------|
| DRAFT | Event has been created but is not yet visible to the public. |
| PUBLISHED | Event is publicly available and can be viewed or booked. |
| CANCELLED | Event has been cancelled and is no longer active. |
| COMPLETED | Event has concluded successfully. |

---

# Constraints

## Email

The **email** column has a unique constraint to prevent duplicate accounts.

Example:

```text id="d9c5e4"
parthib@test.com
```

cannot exist multiple times.

## Slug

The **slug** column has a unique constraint.

The application automatically generates a URL-friendly slug from the event title.

Duplicate titles receive incremental suffixes.

Example:

```
dhaka-metal-fest-2026
dhaka-metal-fest-2026-2
dhaka-metal-fest-2026-3
```

---

# Current Relationships

## users → events

Relationship:

* One User can create many Events.
* Each Event belongs to one User.

Relationship Type:

One-to-Many

```
users (1)
    │
    └────────────< events (*)
```

Foreign Key:

```
events.createdById
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
    ├───────────< refresh_tokens
    ├───────────< bookings
    └───────────< payments
```

## refresh_tokens

Purpose:

- Store active refresh tokens
- Support refresh token rotation
- Enable secure logout
- Enable logout from all devices
- Track authenticated user sessions

Planned fields:

| Column | Type | Constraint |
|---------|------|------------|
| id | UUID | Primary Key |
| userId | UUID | Foreign Key |
| tokenHash | varchar | Required |
| expiresAt | timestamp | Required |
| revokedAt | timestamp | Nullable |
| createdAt | timestamp | Auto-generated |

---

# Entity Relationships

```
User
 ├── id
 ├── firstName
 ├── ...
 └──────────────┐
                │
                │ One-to-Many
                ▼
Event
 ├── id
 ├── title
 ├── slug
 ├── status
 └── createdById (FK)
```
---

# Last Updated

2026-07-15