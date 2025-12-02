# API Documentation

Base URL: `https://********.com/api`

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Obtain Token
**POST /api/auth/login**

Request:
```json
{
"email": "user@example.com",
"password": "password123"
}
```

Response (200):
```json
{
"success": true,
"data": {
"token": "eyJhbGciOiJIUzI1NiIs...",
"user": {
"id": 1,
"email": "user@example.com",
"name": "John Doe"
}
}
}
```

## Endpoints

### Users

#### Get User by ID
**GET /api/users/:id**

**Authentication**: Required  
**Authorization**: User must be accessing own profile or be admin

**Parameters**:
- `id` (path): User ID

**Response** (200):
```json
{
"success": true,
"data": {
"id": 1,
"email": "user@example.com",
"name": "John Doe",
"created_at": "2025-01-01T00:00:00Z"
}
}
```

**Errors**:
- 401: Not authenticated
- 403: Not authorized
- 404: User not found

#### Update User
**PUT /api/users/:id**

**Authentication**: Required  
**Authorization**: User must be updating own profile or be admin

**Request**:
```json
{
"name": "Jane Doe",
"email": "jane@example.com"
}
```

**Response** (200):
```json
{
"success": true,
"data": {
"id": 1,
"email": "jane@example.com",
"name": "Jane Doe"
}
}
```

[Document all endpoints similarly]

## Error Responses

All error responses follow this format:
```json
{
"success": false,
"error": {
"code": "ERROR_CODE",
"message": "Human-readable error message"
}
}
```

**Common Error Codes**:
- `VALIDATION_ERROR`: Request validation failed
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Server error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated requests

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000