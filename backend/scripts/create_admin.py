import sys
import os
import asyncio
import getpass
from dotenv import load_dotenv

# Load environment variables from backend/.env
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

# Add the backend directory to the Python path to enable app imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select

from app.models.user import User
from app.core.security import get_password_hash
from app.config import settings # Import settings
from app.db import Base # Import Base

# Use the database URL from the loaded settings
DATABASE_URL = settings.sqlite_database_url

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def init_db():
    """
    Initializes the database and creates tables.
    """
    async with engine.begin() as conn:
        print("Initializing database...")
        await conn.run_sync(Base.metadata.create_all)
        print("Database initialized.")

async def create_admin():
    """
    Creates an administrative user in the database.
    """
    print("--- Admin User Creation ---")
    email = input("Enter email for the new admin user: ").strip()
    
    async with AsyncSessionLocal() as db:
        # Check if user already exists
        result = await db.execute(select(User).filter(User.email == email))
        if result.scalars().first():
            print(f"Error: A user with the email '{email}' already exists.")
            return

        password = getpass.getpass("Enter password: ")
        confirm_password = getpass.getpass("Confirm password: ")

        if password != confirm_password:
            print("Error: Passwords do not match.")
            return
        
        if not password:
            print("Error: Password cannot be empty.")
            return

        hashed_password = get_password_hash(password)
        
        admin_user = User(
            email=email,
            hashed_password=hashed_password,
            role="admin",
            is_active=True
        )
        
        db.add(admin_user)
        await db.commit()
        
        print("\nAdmin user created successfully!")
        print(f"Email: {email}")
        print("Role: admin")
        print("Status: active")

async def main():
    await init_db()
    await create_admin()

if __name__ == "__main__":
    # To run this script, navigate to the project's root directory and execute:
    # python backend/scripts/create_admin.py
    asyncio.run(main())
