from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from fastapi import FastAPI
from .config import settings

# SQLAlchemy setup for SQLite
DATABASE_URL = settings.sqlite_database_url
engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)
Base = declarative_base()

async def get_db():
    async with SessionLocal() as session:
        yield session

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Connecting to SQLite...")
    try:
        # Test connection and create tables
        async with engine.begin() as conn: # Use engine.begin() for an async transaction
            await conn.run_sync(Base.metadata.create_all) # Create tables if they don't exist
        print("Successfully connected to SQLite and ensured tables are created!")
    except Exception as e:
        print(f"ERROR: Could not connect to SQLite: {e}")
        # Depending on the severity, you might want to re-raise or handle differently
        # raise e

    yield

    print("SQLite connection pool closed.")
