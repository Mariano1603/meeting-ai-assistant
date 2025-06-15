# Setup Guide

This guide will help you set up the Meeting AI Assistant project for development. This includes both the backend API and the complete Next.js frontend application.

## Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.11 or higher)
- **Docker** and **Docker Compose**
- **PostgreSQL** (if running locally)
- **Redis** (if running locally)

## Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meeting-whisperer
   ```

2. **Run the setup script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the full-stack application**
   ```bash
   docker-compose up --build -d
   ```

## Manual Setup

### Backend Setup

1. **Create virtual environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up database**
   ```bash
   # Create PostgreSQL database
   createdb meeting_whisperer
   
   # Run migrations
   alembic upgrade head
   ```

4. **Start the backend**
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

## Environment Variables

Copy `.env.example` to `.env` and configure the following:

### Required
- `OPENAI_API_KEY`: Your OpenAI API key for Whisper and GPT
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string

### Optional
- `SMTP_*`: Email configuration for sending summaries
- `SLACK_*`: Slack integration for notifications

## Services

After setup, the following services will be available:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Frontend Features (✅ Complete)

The frontend application includes:

### Authentication System
- User registration and login
- JWT token management
- Protected routes and authentication guards
- Persistent login sessions

### Dashboard
- Meeting overview and statistics
- Recent meetings display
- Quick access to upload functionality
- User profile management

### Meeting Management
- File upload with drag-and-drop support
- Meeting list with search and filtering
- Individual meeting detail pages
- Real-time processing status updates

### User Interface
- Modern, responsive design with Tailwind CSS
- Dark/light theme support
- Accessible UI components using Shadcn/ui
- Mobile-friendly responsive layout
- Loading states and error handling

## Development Commands

```bash
# Start all services with Docker
npm run docker:dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Run tests
npm run test

# Lint code
npm run lint
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 8000, 5432, and 6379 are available
2. **OpenAI API errors**: Verify your API key is correct and has sufficient credits
3. **Database connection**: Ensure PostgreSQL is running and credentials are correct
4. **File upload issues**: Check that the uploads directory has proper permissions

### Logs

```bash
# View Docker logs
docker-compose -f docker/docker-compose.yml logs -f

# View specific service logs
docker-compose -f docker/docker-compose.yml logs -f backend
```

