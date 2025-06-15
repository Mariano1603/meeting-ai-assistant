# Meeting AI Assistant API Documentation

The Meeting AI Assistant API provides endpoints for meeting transcription, summarization, and task extraction. This API is now integrated with a complete Next.js frontend application providing a full-stack solution.

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true,
    "created_at": "2023-12-01T10:00:00Z"
  },
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```

#### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Meetings

#### GET /meetings
Get all meetings for the authenticated user.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Weekly Team Meeting",
    "description": "Discussion about project progress",
    "file_name": "meeting.mp3",
    "duration": 3600,
    "status": "completed",
    "created_at": "2023-12-01T10:00:00Z",
    "tasks": [...]
  }
]
```

#### POST /meetings/upload
Upload a new meeting file for processing.

**Request:**
- Content-Type: `multipart/form-data`
- Form fields:
  - `file`: The audio/video file
  - `title`: Meeting title
  - `description`: Optional meeting description

**Response:**
```json
{
  "meeting_id": "uuid",
  "status": "uploading",
  "message": "File uploaded successfully. Processing will begin shortly."
}
```

#### GET /meetings/{id}
Get details of a specific meeting.

**Response:**
```json
{
  "id": "uuid",
  "title": "Weekly Team Meeting",
  "description": "Discussion about project progress",
  "file_name": "meeting.mp3",
  "duration": 3600,
  "transcription": "Full meeting transcription...",
  "summary": "Meeting summary with key points...",
  "status": "completed",
  "created_at": "2023-12-01T10:00:00Z",
  "tasks": [
    {
      "id": "uuid",
      "title": "Update project timeline",
      "assignee": "John Doe",
      "due_date": "2023-12-08",
      "status": "todo",
      "priority": "high"
    }
  ]
}
```

### Tasks

#### GET /meetings/{meeting_id}/tasks
Get all tasks extracted from a specific meeting.

#### POST /tasks
Create a new task manually.

**Request Body:**
```json
{
  "title": "Follow up with client",
  "description": "Send project proposal",
  "assignee": "jane@example.com",
  "due_date": "2023-12-15",
  "priority": "medium",
  "meeting_id": "uuid"
}
```

#### PUT /tasks/{id}
Update an existing task.

#### DELETE /tasks/{id}
Delete a task.

### AI Services

#### POST /ai/transcribe
Transcribe an audio/video file (internal endpoint, typically called automatically).

#### POST /ai/summarize
Generate a summary from transcription text.

#### POST /ai/extract-tasks
Extract actionable tasks from transcription text.

## Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

## Error Response Format

```json
{
  "detail": "Error message",
  "error_code": "SPECIFIC_ERROR_CODE"
}
```

## File Upload Constraints

- **Maximum file size:** 100MB
- **Supported formats:** MP3, WAV, M4A, MP4, AVI, MOV
- **Recommended:** High-quality audio for better transcription accuracy

## Rate Limits

- **File uploads:** 10 files per hour per user
- **API requests:** 1000 requests per hour per user

## Webhooks (Optional)

You can configure webhooks to receive notifications when meeting processing is complete:

```json
{
  "event": "meeting.processed",
  "meeting_id": "uuid",
  "status": "completed",
  "timestamp": "2023-12-01T10:30:00Z"
}
```

