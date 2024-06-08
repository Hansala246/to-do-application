# database.py
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017')

database = client.TODO_App

collection_user = database["users"]
collection_todo = database["todos"]
