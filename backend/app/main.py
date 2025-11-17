from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .api import auth, dashboard
from .db import engine as postgres_engine, Base as PostgresBase
from .mongodb import connect_to_mongo, close_mongo_connection
from .models import user

@asynccontextmanager
async def app_lifespan(app: FastAPI):
    # Startup
    print("Connecting to databases...")
    connect_to_mongo()
    try:
        async with postgres_engine.begin() as conn:
            await conn.run_sync(PostgresBase.metadata.create_all)
        print("Successfully connected to PostgreSQL and ensured tables are created!")
    except Exception as e:
        print(f"ERROR: Could not connect to PostgreSQL: {e}")
    
    yield
    
    # Shutdown
    print("Closing database connections...")
    close_mongo_connection()


app = FastAPI(
    title="Media-Scan Backend",
    description="API pour l'analyse et le monitoring des médias.",
    version="0.1.0",
    lifespan=app_lifespan # Use the new combined lifespan manager
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
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
