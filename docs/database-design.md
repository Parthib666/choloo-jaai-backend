# Database Design

## Database

The backend uses **PostgreSQL 16** as the primary relational database.

ORM:

- TypeORM

---

# Current Tables

## users

### Purpose

Stores all platform users, including:

- Customers
- Corporate Clients
- Event Managers
- Administrators

---

## Schema

| Column | Type | Constraint |
|---------|------|------------|
| id | UUID | Primary Key |
| firstName | varchar | Required |
| lastName | varchar | Required |
| email | varchar | Unique |
| phone | varchar | Nullable |
| passwordHash | varchar | Required |
| role | enum | Default CUSTOMER |
| status | enum | Default ACTIVE |
| createdAt | timestamp | Auto-generated |
| updatedAt | timestamp | Auto-generated |

---

## Enums

### UserRole

- CUSTOMER
- EVENT_MANAGER
- CORPORATE_CLIENT
- ADMIN

### UserStatus

- ACTIVE
- INACTIVE
- SUSPENDED

---

## Constraints

### Email

The **email** column has a unique constraint to prevent duplicate accounts.

---

## Current Relationships

At the current stage of development, the **users** table has no foreign key relationships.

Relationships will be introduced when implementing:

- Events
- Bookings
- Tickets
- Payments