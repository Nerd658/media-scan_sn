from motor.motor_asyncio import AsyncIOMotorClient

class MongoDB:
    client: AsyncIOMotorClient = None

db = MongoDB()

# Hardcoded connection string as requested
MONGO_CONNECTION_STRING = "mongodb+srv://m9bikienga_db_user:Iu9F9IRpftNlIhIL@media-scan.ehppu00.mongodb.net/?appName=media-scan"
MONGO_DATABASE = "media_scan_db"

async def get_database() -> AsyncIOMotorClient:
    return db.client[MONGO_DATABASE]

def connect_to_mongo():
    print("Connecting to MongoDB...")
    db.client = AsyncIOMotorClient(MONGO_CONNECTION_STRING)
    print("Successfully connected to MongoDB.")

def close_mongo_connection():
    print("Closing MongoDB connection.")
    db.client.close()
    print("MongoDB connection closed.")
