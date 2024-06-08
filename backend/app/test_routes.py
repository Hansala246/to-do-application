import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_user():
    response = client.post("/users", json={"user_email": "test@example.com", "user_pw": "password123"})
    assert response.status_code == 200
    assert response.json() == {"message": "User created successfully"}

def test_login_user():
    response = client.post("/token", data={"username": "test@example.com", "password": "password123"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_create_task():
    response = client.post("/token", data={"username": "test@example.com", "password": "password123"})
    token = response.json()["access_token"]
    response = client.post("/tasks", json={"title": "New Task", "description": "Test task", "completed": False},
                           headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == {"message": "Task created successfully"}
