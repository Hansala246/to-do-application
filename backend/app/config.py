#config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "TODO APP"
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DB: str = os.getenv("MONGODB_DB", "TODO_App")
    MONGODB_COLLECTION: str = os.getenv("MONGODB_COLLECTION", "items")

settings = Settings()

SECRET_KEY = "TODOAPP" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 180 
