# database.py
from pymongo import MongoClient

MONGODB_URL = "mongodb://localhost:27017"

client = MongoClient(MONGODB_URL)

database = client.TODO_App

collection_user = database["users"]
collection_todo = database["todos"]
