from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import conversations, scenarios, users, feedback
from app.core.config import settings

app = FastAPI(
    title="Vital Talk API",
    description="AI-powered conversational training platform for end-of-life conversations",
    version="0.1.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(scenarios.router, prefix="/api/scenarios", tags=["scenarios"])
app.include_router(conversations.router, prefix="/api/conversations", tags=["conversations"])
app.include_router(feedback.router, prefix="/api/feedback", tags=["feedback"])

@app.get("/")
async def root():
    return {
        "message": "Vital Talk API",
        "version": "0.1.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
