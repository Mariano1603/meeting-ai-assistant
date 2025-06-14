# Setup Guide

This guide will help you set up the Meeting Whisperer project for development.

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

4. **Start the application**
   ```bash
   npm run docker:dev
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

