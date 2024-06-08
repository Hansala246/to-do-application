#routes.py
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.models import User_login, User,Todos
from app.config import ACCESS_TOKEN_EXPIRE_MINUTES
import app.services
from app.utils import get_current_user
from typing import List

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    return await app.services.login_user(form_data, ACCESS_TOKEN_EXPIRE_MINUTES)

@router.post("/users")
async def create_user(user: User):
    return app.services.create_new_user(user)

@router.post("/login")
async def login(user_login: User_login ):
    return app.services.login_user_manual(user_login, ACCESS_TOKEN_EXPIRE_MINUTES)

@router.post("/tasks")
async def create_task(task: Todos, current_user: User = Depends(get_current_user)):
    return app.services.create_task(task, current_user)

@router.put("/tasks/{task_id}")
async def update_task(task_id: str, task: Todos, current_user: User = Depends(get_current_user)):
    return app.services.update_task(task_id, task, current_user)

@router.put("/tasks/{task_id}/complete")
async def complete_task(task_id: str, current_user: User = Depends(get_current_user)):
    return app.services.complete_task(task_id, current_user)

@router.delete("/tasks/{task_id}")
async def delete_task(task_id: str, current_user: User = Depends(get_current_user)):
    return app.services.delete_task(task_id, current_user)

@router.get("/tasks", response_model=List[Todos])
async def get_tasks(current_user: User = Depends(get_current_user), sort_by: str = None, filter_by: str = None):
    return app.services.get_tasks(current_user, sort_by, filter_by)

@router.put("/tasks/{task_id}/reorder") 
async def reorder_task(task_id: str, new_position: int, current_user: User = Depends(get_current_user)):
    return app.services.reorder_task(task_id, new_position, current_user)

@router.get("/tasks/{task_id}", response_model=Todos)
async def get_task(task_id: str, current_user: User = Depends(get_current_user)):
    return app.services.get_tasks2(task_id, current_user)
