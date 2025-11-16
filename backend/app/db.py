from contextlib import asynccontextmanager
import motor.motor_asyncio
from fastapi import FastAPI
from .config import settings

db = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Connecting to MongoDB...")
    try:
        client = motor.motor_asyncio.AsyncIOMotorClient(settings.mongo_connection_string)
        await client.admin.command('ping')
        db["client"] = client
        db["database"] = client.get_database("media_scan_db")
        db["analyses_collection"] = db["database"].get_collection("analyses")
        print("Successfully connected to MongoDB!")
    except Exception as e:
        print(f"ERROR: Could not connect to MongoDB: {e}")
        # raise e # You might want to uncomment this in production

    yield

    if "client" in db:
        db["client"].close()
        print("MongoDB connection closed.")
