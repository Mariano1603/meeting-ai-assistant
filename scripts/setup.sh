#!/bin/bash

# Meeting Whisperer Setup Script
echo "🎙️ Setting up Meeting Whisperer..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Creating .env file from template..."
    cp .env.example .env
    echo "✅ Please edit .env file with your configuration before proceeding."
    echo "📝 Make sure to add your OpenAI API key!"
else
    echo "✅ .env file already exists."
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies (if running locally)
echo "🐍 Setting up Python virtual environment..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Create uploads directory
mkdir -p uploads

echo "🎉 Setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. Edit .env file with your API keys"
echo "2. Run 'npm run docker:dev' to start with Docker"
echo "   OR"
echo "   Run 'npm run dev' for local development"
echo ""
echo "🔗 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:8000"
echo "🔗 API Docs: http://localhost:8000/docs"

