# Users Table

## Purpose

Stores all platform users.

Users include:

- Public customers
- Corporate clients
- Event managers
- Administrators


## Current Schema

Table:


users



Columns:

| Column | Type | Constraint |
|-|-|-|
| id | UUID | Primary Key |
| firstName | varchar | Required |
| lastName | varchar | Required |
| email | varchar | Unique |
| phone | varchar | Optional |
| passwordHash | varchar | Required |
| role | enum | Default CUSTOMER |
| status | enum | Default ACTIVE |
| createdAt | timestamp | Auto |
| updatedAt | timestamp | Auto |


## Constraints

### Email

Unique constraint prevents multiple accounts using the same email.

Example:


parthib@test.com


cannot exist twice.