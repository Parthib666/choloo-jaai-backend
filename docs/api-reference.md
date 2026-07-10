# Users API


Base URL:


http://localhost:3000



---

# GET All Users

Endpoint:


GET /users



Response:

```json
[
  {
    "id": "uuid",
    "firstName": "Parthib",
    "lastName": "Datta",
    "email": "parthib@test.com"
  }
]
POST Create User

Endpoint:

POST /users

Request:

{
  "firstName": "Parthib",
  "lastName": "Datta",
  "email": "parthib@test.com",
  "phone": "01700000000",
  "passwordHash": "temporary_hash"
}

Success:

201 Created

Duplicate Email:

409 Conflict

Response:

{
  "message": "Email already exists",
  "error": "Conflict",
  "statusCode": 409
}

---

# 4. Update `development-guide.md`

Append:

```md
# Current Development Workflow

For each feature:

1. Plan architecture
2. Implement code
3. Test with Postman
4. Update documentation
5. Commit changes
6. Push to GitHub


## API Testing

Tool:


Postman



Verified:

- GET users endpoint
- POST users endpoint
- Validation errors
- Duplicate email handling


## Git Workflow

Backend changes:


feature implementation
|
↓
git commit
|
↓
git push



Documentation is maintained together with code changes.