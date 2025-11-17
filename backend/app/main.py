from fastapi import FastAPI
from .api import analysis, history, monitoring, stats, sources # Import the new sources router
from .db import close_db_connection, connect_to_db

app = FastAPI(
    title="Media-Scan Backend",
    description="API pour l'analyse et le monitoring des médias.",
    version="0.1.0",
)

# Event handlers for database connection
app.add_event_handler("startup", connect_to_db)
app.add_event_handler("shutdown", close_db_connection)

# Include API routers
app.include_router(analysis.router, prefix="/analysis", tags=["Analysis"])
app.include_router(history.router, prefix="/history", tags=["History"])
app.include_router(monitoring.router, prefix="/monitoring", tags=["Monitoring"])
app.include_router(stats.router, prefix="/stats", tags=["Stats"])
app.include_router(sources.router, prefix="/sources", tags=["Sources"]) # Include the new sources router
