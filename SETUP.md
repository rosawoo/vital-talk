# Vital Talk - Setup Guide

## Prerequisites

- Docker & Docker Compose
- OpenAI API Key
- Node.js 20+ (for local development without Docker)
- Python 3.11+ (for local development without Docker)

## Quick Start with Docker (Recommended)

### 1. Clone the Repository

```bash
cd /Users/rosawu/Documents/vital-talk
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=your-openai-api-key-here
```

### 3. Start All Services

```bash
docker-compose up --build
```

This will start:
- **PostgreSQL** (port 5432)
- **Redis** (port 6379)
- **Backend API** (port 8000)
- **Frontend** (port 3000)

### 4. Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

API documentation is available at:

```
http://localhost:8000/docs
```

### 5. Stop Services

```bash
docker-compose down
```

To remove volumes (clear database):

```bash
docker-compose down -v
```

## Local Development (Without Docker)

### Backend Setup

1. Create a Python virtual environment:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Start PostgreSQL and Redis locally (or use Docker):

```bash
# PostgreSQL
docker run --name vital-talk-postgres -e POSTGRES_PASSWORD=vital_talk_password -e POSTGRES_USER=vital_talk_user -e POSTGRES_DB=vital_talk -p 5432:5432 -d postgres:15-alpine

# Redis
docker run --name vital-talk-redis -p 6379:6379 -d redis:7-alpine
```

4. Create `.env` file in backend directory:

```
DATABASE_URL=postgresql://vital_talk_user:vital_talk_password@localhost:5432/vital_talk
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your-openai-api-key-here
```

5. Run the backend:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Access at `http://localhost:3000`

## Architecture Overview

### Multi-Agent System

The platform uses a sophisticated multi-agent architecture:

1. **Emotional Agent**: Simulates family member with emotional consistency
2. **Emotion State Manager**: Controls realistic emotion transitions
3. **Conversation Orchestrator**: Coordinates all agents and manages state
4. **Coach Agent**: Evaluates performance and provides feedback
5. **Safety Agent**: Ensures medical accuracy and ethical appropriateness

### Technology Stack

**Frontend:**
- Next.js 14 (React)
- TypeScript
- Tailwind CSS
- WebSocket for real-time communication

**Backend:**
- FastAPI (Python)
- LangChain & LangGraph
- OpenAI GPT-4
- PostgreSQL (persistent storage)
- Redis (conversation state)

## Key Features

### 1. Realistic Emotional Simulation

- Dynamic emotional states (denial, anger, bargaining, sadness, acceptance)
- Emotions evolve based on doctor's responses
- Natural, human-like reactions

### 2. Pause/Redo/Branch

- Pause conversations at any point
- Redo last response to try different approaches
- Checkpointed state for deterministic replay

### 3. Real-Time Feedback

- Get coaching hints during conversation
- Comprehensive post-conversation evaluation
- Scores across 5 dimensions

### 4. Safe Practice Environment

- No real patients affected
- Make mistakes and learn
- Unlimited practice

## API Endpoints

### Scenarios
- `GET /api/scenarios/` - List all scenarios
- `GET /api/scenarios/{id}` - Get scenario details

### Conversations
- `POST /api/conversations/start` - Start new conversation
- `WS /api/conversations/ws/{id}` - WebSocket for real-time chat
- `POST /api/conversations/pause/{id}` - Pause conversation
- `POST /api/conversations/redo/{id}` - Redo last turn
- `GET /api/conversations/{id}/feedback` - Get feedback

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login
- `GET /api/users/me` - Get current user

## Troubleshooting

### WebSocket Connection Issues

If WebSocket fails to connect:

1. Check backend is running on port 8000
2. Verify firewall settings
3. Check browser console for errors

### Docker Issues

If containers fail to start:

```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild without cache
docker-compose build --no-cache

# Reset everything
docker-compose down -v
docker-compose up --build
```

### OpenAI API Issues

If you get OpenAI errors:

1. Verify API key is set in `.env`
2. Check API key has sufficient credits
3. Verify internet connection

## Next Steps

1. Add database migrations with Alembic
2. Implement user authentication
3. Add Japanese language support
4. Create more scenarios
5. Add voice input/output
6. Implement progress tracking

## Contributing

This is a prototype project. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

TBD

## Support

For issues or questions, please open an issue on GitHub.
