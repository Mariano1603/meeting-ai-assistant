# Meeting AI Assistant

AI-powered meeting transcription and summarization platform that automatically converts audio recordings into structured meeting notes, summaries, and actionable tasks.

## 🚀 Features

- **Audio Transcription**: Automatic speech-to-text conversion using OpenAI Whisper
- **AI Summarization**: Intelligent meeting summaries with key points and decisions
- **Task Extraction**: Automatic identification and tracking of action items
- **User Authentication**: Secure JWT-based authentication system
- **RESTful API**: Comprehensive API for integration with other tools
- **Background Processing**: Asynchronous processing using Celery workers
- **Email Notifications**: Automated meeting summaries via email
- **Slack Integration**: Direct integration with Slack for notifications

## 🏗️ Architecture

### Backend (Current Status: ✅ Complete)
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Primary database for structured data
- **Redis** - Caching and message broker for Celery
- **Celery** - Background task processing
- **SQLAlchemy** - ORM for database operations
- **OpenAI API** - AI processing for transcription and summarization

### Frontend (Coming Next)
- **Next.js** - React framework for the web interface
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework

## 🛠️ Quick Start (Backend Only)

### Prerequisites
- Docker and Docker Compose
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Sonupandit9693/meeting-ai-assistant.git
cd meeting-ai-assistant
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env file with your actual values (OpenAI API key, etc.)
```

### 3. Start Backend Services
```bash
docker-compose -f docker-compose.backend.yml up --build -d
```

### 4. Verify Installation
```bash
# Check if services are running
docker-compose -f docker-compose.backend.yml ps

# Test the API
curl http://localhost:8000/health
```

## 📚 API Documentation

Once the backend is running, you can access:
- **API Documentation**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 🔗 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

### Meetings
- `GET /api/v1/meetings/` - List meetings
- `GET /api/v1/meetings/{id}` - Get meeting details
- `PUT /api/v1/meetings/{id}` - Update meeting
- `DELETE /api/v1/meetings/{id}` - Delete meeting

### File Upload
- `POST /api/v1/upload/meeting` - Upload meeting audio file

### Tasks
- `GET /api/v1/tasks/` - List tasks
- `POST /api/v1/tasks/` - Create task
- `GET /api/v1/tasks/meeting/{meeting_id}` - Get tasks for meeting

## 🐳 Services

When running with Docker Compose, the following services are available:

| Service | Port | Description |
|---------|------|-------------|
| Backend API | 8000 | FastAPI application |
| PostgreSQL | 5432 | Primary database |
| Redis | 6380 | Cache and message broker |
| Celery Worker | - | Background task processor |

## 🔧 Development

### Running Tests
```bash
# Basic API functionality test
python3 test_backend.py
```

### Viewing Logs
```bash
# Backend logs
docker logs meeting_whisperer_backend

# Celery worker logs
docker logs meeting_whisperer_worker

# Database logs
docker logs meeting_whisperer_db
```

### Stopping Services
```bash
docker-compose -f docker-compose.backend.yml down
```

## 📁 Project Structure

```
meeting-ai-assistant/
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── api/            # API route definitions
│   │   ├── core/           # Core configuration and database
│   │   ├── models/         # SQLAlchemy database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic and AI services
│   │   └── workers/        # Celery workers
│   └── requirements.txt    # Python dependencies
├── docker/                 # Docker configuration
│   └── backend.Dockerfile  # Backend container definition
├── frontend/               # Next.js frontend (coming soon)
├── docker-compose.backend.yml  # Backend-only Docker Compose
├── .env.example           # Environment variables template
└── README.md             # This file
```

## 🌟 Roadmap

- [x] Backend API Development
- [x] Database Models & Authentication
- [x] AI Processing Services
- [x] Background Task Processing
- [x] Docker Containerization
- [ ] Frontend Development (Next.js)
- [ ] Real-time WebSocket Updates
- [ ] Advanced AI Features
- [ ] Mobile Application
- [ ] Enterprise Features

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for Whisper and GPT models
- FastAPI for the excellent web framework
- The open-source community for amazing tools

---

**Note**: This is currently a backend-only implementation. Frontend development is in progress and will be added in upcoming releases.

