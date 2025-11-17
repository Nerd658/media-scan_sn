import json
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone

# --- Configuration ---
MONGO_CONNECTION_STRING = "mongodb+srv://m9bikienga_db_user:Iu9F9IRpftNlIhIL@media-scan.ehppu00.mongodb.net/?appName=media-scan"
MONGO_DATABASE = "media_scan_db"

# Define the files and their target collections
DATA_FILES = {
    "influence_ranking": "frontend/media-scan/public/data/influence_ranking.json",
    "monitoring_alerts": "frontend/media-scan/public/data/monitoring_alerts.json",
    "sensitive_alerts": "frontend/media-scan/public/data/sensitive_alerts.json",
    "media_trends": "frontend/media-scan/public/data/monitoring_trends.json",
    "theme_distribution": "frontend/media-scan/public/data/monitoring_themes_distribution.json",
}

def parse_date(date_str):
    """
    Tries to parse a date string, returns current time if it fails.
    """
    try:
        return datetime.fromisoformat(date_str)
    except (ValueError, TypeError):
        try:
            return datetime.strptime(date_str.split('.')[0], "%Y-%m-%dT%H:%M:%S").replace(tzinfo=timezone.utc)
        except (ValueError, TypeError):
            return datetime.now(timezone.utc)


async def seed_collection(db, collection_name, file_path):
    """Seeds a single collection from a JSON file."""
    collection = db[collection_name]
    
    print(f"\n--- Seeding collection: {collection_name} ---")
    
    # Load data from JSON file
    print(f"Reading data from {file_path}...")
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
            
            # Special handling for different data structures
            if collection_name == 'monitoring_alerts':
                for item in data:
                    item['date'] = parse_date(item.get('date'))
            
            elif collection_name == 'media_trends':
                # Convert dictionary to a list of documents
                data = [{"media": key, **value} for key, value in data.items()]
            
            elif collection_name == 'theme_distribution':
                # Rename the 'global' key to 'global_themes' to avoid keyword conflicts
                if 'global' in data:
                    data['global_themes'] = data.pop('global')
                # This file is a single object, so we wrap it in a list for processing
                data = [data]

            print(f"Successfully loaded and processed data from JSON file.")
    except FileNotFoundError:
        print(f"ERROR: JSON file not found at '{file_path}'.")
        return
    except json.JSONDecodeError as e:
        print(f"ERROR: Could not decode JSON. Error: {e}")
        return

    # Clear existing data
    print(f"Clearing existing data from '{collection_name}'...")
    delete_result = await collection.delete_many({})
    print(f"Deleted {delete_result.deleted_count} records.")

    # Insert new data
    if data:
        print(f"Inserting {len(data)} new record(s)...")
        if len(data) == 1 and collection_name == 'theme_distribution':
            insert_result = await collection.insert_one(data[0])
            print(f"Successfully inserted 1 document.")
        else:
            insert_result = await collection.insert_many(data)
            print(f"Successfully inserted {len(insert_result.inserted_ids)} records.")
    else:
        print("No data to insert.")

async def main():
    print("Starting MongoDB seeding process...")
    client = AsyncIOMotorClient(MONGO_CONNECTION_STRING)
    db = client[MONGO_DATABASE]

    for collection_name, file_path in DATA_FILES.items():
        await seed_collection(db, collection_name, file_path)

    client.close()
    print("\nMongoDB seeding process finished.")

if __name__ == "__main__":
    # In your terminal, from the project's ROOT directory, run:
    # python backend/scripts/seed_db.py
    asyncio.run(main())
