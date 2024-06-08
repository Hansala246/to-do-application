# models.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class User_login(BaseModel):
    email: str
    password: str
    
class User(BaseModel):
    name:str
    user_email:str
    user_pw:str

class Todos(BaseModel):
    task_id: Optional[str]
    task: str
    completed: Optional[bool]
    priority: Optional[int]
    due_date: Optional[datetime]

# class GetTodos(BaseModel):
#     task_id: Optional[str]  # Include task_id as an optional field
#     task: str
#     completed: Optional[bool]
#     priority: Optional[int]
#     due_date: Optional[datetime] 