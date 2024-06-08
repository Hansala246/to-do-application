# services.py
from app.database import collection_user,collection_todo
from app.models import User,Todos
from app.utils import hash_password, verify_password, create_access_token,authenticate_user
from datetime import timedelta
from fastapi import HTTPException
from bson import ObjectId
from pymongo import DESCENDING
from typing import List
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def login_user(form_data, access_token_expire_minutes):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token_expires = timedelta(minutes=access_token_expire_minutes)
    access_token = create_access_token(data={"email": user['user_email']}, expires_delta=access_token_expires)
    print(access_token)
    return {"access_token": access_token,"token_type": "bearer"}

def create_new_user(user:User):
    existing_user = collection_user.find_one({"user_email": user.user_email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password before storing in the database
    hashed_password = hash_password(user.user_pw)
    
    # Modify user data to include hashed password
    user_data = user.dict()
    user_data["user_pw"] = hashed_password

    # Insert user data into MongoDB
    inserted_user = collection_user.insert_one(user_data)

    return {"message": "User created successfully"}

def login_user_manual(user_login, ACCESS_TOKEN_EXPIRE_MINUTES):
    existing_user = collection_user.find_one(
        {"user_email": user_login.email}, 
        {"_id": 0, "user_email": 1, "user_pw": 1, "user_type": 1}
    )
    if not existing_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user_pw = existing_user["user_pw"]  

    if not verify_password(user_login.password, user_pw):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"email": user_login.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token}


def create_task(task: Todos, current_user):
    last_task = collection_todo.find_one(sort=[("_id", -1)])
    last_id = last_task["task_id"] if last_task else "T000"
    last_seq = int(last_id[1:])
    new_seq = last_seq + 1
    task_id = f"T{new_seq:03d}"
    task_data = task.dict()
    task_data["task_id"] = task_id
    task_data["user_email"] = current_user["user_email"]
    collection_todo.insert_one(task_data)
    return {"message": "Task created successfully"}

def update_task(task_id: str, task: Todos, current_user):
    existing_task = collection_todo.find_one({"task_id": task_id, "user_email": current_user["user_email"]})
    if not existing_task:
        raise HTTPException(status_code=404, detail="Task not found")
    collection_todo.update_one({"task_id": task_id}, {"$set": task.dict()})
    return {"message": "Task updated successfully"}

def complete_task(task_id: str, current_user):
    existing_task = collection_todo.find_one({"task_id": task_id, "user_email": current_user["user_email"]})
    if not existing_task:
        raise HTTPException(status_code=404, detail="Task not found")
    collection_todo.update_one({"task_id": task_id}, {"$set": {"completed": True}})
    return {"message": "Task marked as completed"}

def delete_task(task_id: str, current_user):
    existing_task = collection_todo.find_one({"task_id": task_id, "user_email": current_user["user_email"]})
    if not existing_task:
        raise HTTPException(status_code=404, detail="Task not found")
    collection_todo.delete_one({"task_id": task_id})
    return {"message": "Task deleted successfully"}

def get_tasks(current_user, sort_by: str = None, filter_by: str = None) -> List[Todos]:
    query = {"user_email": current_user["user_email"]}
    if filter_by:
        if filter_by.lower() == "completed":
            query["completed"] = True
    tasks = collection_todo.find(query)
    if sort_by:
        if sort_by == "due_date":
            tasks = tasks.sort("due_date", DESCENDING)
        elif sort_by == "priority":
            tasks = tasks.sort("priority", DESCENDING)
    return list(tasks)


def reorder_task(task_id: str, new_position: int, current_user):
    tasks = list(collection_todo.find({"user_email": current_user["user_email"]}).sort("order"))
    task = next((t for t in tasks if t["task_id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    tasks.remove(task)
    tasks.insert(new_position, task)
    for idx, t in enumerate(tasks):
        collection_todo.update_one({"task_id": t["task_id"]}, {"$set": {"order": idx}})
    return {"message": "Task reordered successfully"}

def get_tasks2(task_id: str, current_user):
    task = collection_todo.find_one({"task_id": task_id, "user_email": current_user["user_email"]})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

