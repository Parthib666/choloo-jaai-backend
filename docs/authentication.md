# Authentication Design

Status:

Pending


Planned implementation:

- JWT authentication
- bcrypt password hashing
- Access token
- Refresh token
- Role-based authorization


Expected flow:

User Login


Email + Password
|
↓
bcrypt verification
|
↓
JWT generation
|
↓
Authenticated request



Planned roles:

- CUSTOMER
- CLIENT
- EVENT_MANAGER
- ADMIN