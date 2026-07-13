# Database Design

## Database

The backend uses **PostgreSQL 16** as the primary relational database.

ORM:

* TypeORM

---

# Current Tables

## users

### Purpose

Stores all platform users, including:

* Customers
* Clients
* Event Managers
* Administrators

---

## Schema

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

# Column Details

## passwordHash

The database stores encrypted password hashes generated using bcrypt.

Rules:

* Plain passwords are never stored.
* Password hashes are never exposed through API responses.
* Password verification is handled by the authentication module.

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

---

# Constraints

## Email

The **email** column has a unique constraint to prevent duplicate accounts.

Example:

```text id="d9c5e4"
parthib@test.com
```

cannot exist multiple times.

---

# Current Relationships

At the current stage of development, the **users** table has no foreign key relationships.

Relationships will be introduced as additional modules are implemented, including:

- Refresh Tokens
- Events
- Bookings
- Tickets
- Payments

Diagram:
Current

users

Future

users (1)
    │
    ├───────────< refresh_tokens
    ├───────────< events
    ├───────────< bookings
    └───────────< payments

---

# Planned Tables

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

# Last Updated

2026-07-14