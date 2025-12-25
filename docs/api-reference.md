# API Reference

Complete reference for the Composter REST API.

## Base URL

**Production:** `https://composter.onrender.com/api`

**Self-hosted:** Configure in your `.env` file

## Authentication

All API endpoints (except auth) require JWT authentication.

### Getting a Token

Use Better Auth's sign-in endpoint to get a JWT token:

```bash
curl -X POST https://composter.onrender.com/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourpassword"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Using the Token

Include the JWT token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://composter.onrender.com/api/categories
```

## Endpoints

### Authentication

#### POST `/api/auth/sign-up/email`

Create a new account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/api/auth/sign-in/email`

Login to existing account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET `/api/auth/session`

Get current session info.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "expiresAt": "2025-01-20T10:30:00Z"
  }
}
```

### Categories

#### GET `/api/categories`

List all user's categories.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "categories": [
    {
      "id": "cat_123",
      "name": "buttons",
      "userId": "user_123",
      "createdAt": "2024-12-01T10:00:00Z",
      "componentCount": 5
    },
    {
      "id": "cat_124",
      "name": "forms",
      "userId": "user_123",
      "createdAt": "2024-12-02T14:30:00Z",
      "componentCount": 3
    }
  ]
}
```

#### POST `/api/categories`

Create a new category.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "name": "buttons"
}
```

**Response (201):**
```json
{
  "category": {
    "id": "cat_123",
    "name": "buttons",
    "userId": "user_123",
    "createdAt": "2024-12-01T10:00:00Z"
  }
}
```

**Errors:**
- `400` - Category name already exists
- `401` - Unauthorized
- `422` - Invalid category name

#### DELETE `/api/categories/:name`

Delete a category and all its components.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "message": "Category deleted successfully"
}
```

**Errors:**
- `404` - Category not found
- `401` - Unauthorized

### Components

#### GET `/api/components`

List all user's components (optionally filtered by category).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `category` (optional) - Filter by category name
- `search` (optional) - Search in title and code
- `limit` (optional) - Max results (default: 50)
- `offset` (optional) - Pagination offset

**Example:**
```bash
GET /api/components?category=buttons&limit=10
```

**Response (200):**
```json
{
  "components": [
    {
      "id": "comp_123",
      "title": "PrimaryButton",
      "category": "buttons",
      "code": "export default function PrimaryButton() { ... }",
      "userId": "user_123",
      "createdAt": "2024-12-01T10:00:00Z",
      "updatedAt": "2024-12-15T08:30:00Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

#### GET `/api/components/:category/:title`

Get a specific component.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "component": {
    "id": "comp_123",
    "title": "PrimaryButton",
    "category": "buttons",
    "code": "export default function PrimaryButton({ children, onClick }) {\n  return (\n    <button onClick={onClick}>\n      {children}\n    </button>\n  );\n}",
    "userId": "user_123",
    "createdAt": "2024-12-01T10:00:00Z",
    "updatedAt": "2024-12-15T08:30:00Z"
  }
}
```

**Errors:**
- `404` - Component not found
- `401` - Unauthorized

#### POST `/api/components`

Create or update a component.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "title": "PrimaryButton",
  "category": "buttons",
  "code": "export default function PrimaryButton({ children }) {\n  return <button>{children}</button>;\n}"
}
```

**Response (201 or 200):**
```json
{
  "component": {
    "id": "comp_123",
    "title": "PrimaryButton",
    "category": "buttons",
    "code": "export default function PrimaryButton({ children }) { ... }",
    "userId": "user_123",
    "createdAt": "2024-12-01T10:00:00Z",
    "updatedAt": "2024-12-15T08:30:00Z"
  }
}
```

**Errors:**
- `400` - Invalid request body
- `404` - Category not found
- `401` - Unauthorized

#### DELETE `/api/components/:category/:title`

Delete a component.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "message": "Component deleted successfully"
}
```

**Errors:**
- `404` - Component not found
- `401` - Unauthorized

### User

#### GET `/api/me`

Get current user information.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-11-01T10:00:00Z"
  },
  "stats": {
    "totalComponents": 15,
    "totalCategories": 4,
    "lastActivity": "2024-12-20T14:30:00Z"
  }
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "status": 400
  }
}
```

### Common Error Codes

| Status | Code | Description |
|--------|------|-------------|
| 400 | BAD_REQUEST | Invalid request parameters |
| 401 | UNAUTHORIZED | Missing or invalid authentication |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource already exists |
| 422 | VALIDATION_ERROR | Request validation failed |
| 500 | INTERNAL_ERROR | Server error |

## Rate Limiting

- **Rate limit:** 100 requests per minute per user
- **Headers returned:**
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

**Example:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1703088000
```

When rate limit is exceeded:

```json
{
  "error": {
    "message": "Rate limit exceeded. Please try again later.",
    "code": "RATE_LIMIT_EXCEEDED",
    "status": 429,
    "retryAfter": 60
  }
}
```

## Webhooks

_(Coming soon)_ Subscribe to events like:
- Component created
- Component updated
- Component deleted
- Category created

## Examples

### JavaScript/Node.js

```javascript
const fetch = require('node-fetch');

const BASE_URL = 'https://composter.onrender.com/api';
let token = null;

// Login
async function login(email, password) {
  const response = await fetch(`${BASE_URL}/auth/sign-in/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  token = data.token;
  return data;
}

// Get categories
async function getCategories() {
  const response = await fetch(`${BASE_URL}/categories`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}

// Create component
async function createComponent(category, title, code) {
  const response = await fetch(`${BASE_URL}/components`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ category, title, code })
  });
  return response.json();
}

// Usage
(async () => {
  await login('user@example.com', 'password');
  const categories = await getCategories();
  console.log(categories);
})();
```

## Developer / Local API

If you're developing integrations or testing the API locally, run the API server and point clients (CLI/frontend) to the local base URL.

```bash
cd api
npm install
npm run dev
# Base URL when running locally:
# http://localhost:3000/api
```

When debugging MCP or CLI flows, ensure the API server is running and that `COMPOSTER_API_URL` / `COMPOSTER_API_URL` env variables used by the CLI and MCP point to the local API base URL.

### Python

```python
import requests

BASE_URL = 'https://composter.onrender.com/api'

class ComposterAPI:
    def __init__(self):
        self.token = None
    
    def login(self, email, password):
        response = requests.post(
            f'{BASE_URL}/auth/sign-in/email',
            json={'email': email, 'password': password}
        )
        data = response.json()
        self.token = data['token']
        return data
    
    def get_categories(self):
        response = requests.get(
            f'{BASE_URL}/categories',
            headers={'Authorization': f'Bearer {self.token}'}
        )
        return response.json()
    
    def create_component(self, category, title, code):
        response = requests.post(
            f'{BASE_URL}/components',
            headers={'Authorization': f'Bearer {self.token}'},
            json={'category': category, 'title': title, 'code': code}
        )
        return response.json()

# Usage
api = ComposterAPI()
api.login('user@example.com', 'password')
categories = api.get_categories()
print(categories)
```

### cURL Examples

```bash
# Login
curl -X POST https://composter.onrender.com/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# List categories
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://composter.onrender.com/api/categories

# Create component
curl -X POST https://composter.onrender.com/api/components \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "buttons",
    "title": "PrimaryButton",
    "code": "export default function PrimaryButton() { return <button>Click</button>; }"
  }'
```

## SDK (Coming Soon)

Official SDKs planned for:
- JavaScript/TypeScript
- Python
- Go
- Rust

## See Also

- [Getting Started Guide](getting-started.md)
- [CLI Reference](cli-reference.md)
- [Self-Hosting Guide](self-hosting.md)
- [Troubleshooting](troubleshooting.md)
