from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth, analysis # Import analysis
from .db import lifespan # Import the new lifespan context manager

app = FastAPI(
    title="Media-Scan Backend",
    description="API pour l'analyse et le monitoring des médias.",
    version="0.1.0",
    lifespan=lifespan # Use the new lifespan context manager
)

origins = [
    "http://localhost",
    "http://localhost:5173",  # Assuming your frontend runs on this port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router, prefix="/api/v1", tags=["Authentication"])
app.include_router(analysis.router, prefix="/api/v1", tags=["AI Analysis"]) # Include analysis router

@app.get("/health", tags=["Monitoring"])
async def health_check():
    return {"status": "ok"}

@app.get("/metrics", tags=["Monitoring"])
async def get_metrics():
    # In a real application, this would return actual metrics
    return {
        "uptime": "X hours",
        "requests_total": 12345,
        "errors_total": 12,
        "ai_api_calls_total": 567
    }
