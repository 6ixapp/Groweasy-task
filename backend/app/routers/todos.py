# app/routers/todos.py

from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from app.prisma_client import prisma
from jose import jwt
import os

router = APIRouter()

JWT_SECRET = os.getenv("JWT_SECRET", "supersecret")
JWT_ALGO = "HS256"


def get_current_user(authorization: str | None = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No auth")
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid scheme")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        return payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


class TodoIn(BaseModel):
    title: str


class TodoUpdateIn(BaseModel):
    completed: bool | None = None
    title: str | None = None


@router.get("/")
async def list_todos(user_id: str = Depends(get_current_user)):
    todos = await prisma.todo.find_many(where={"userId": user_id}, order={"createdAt": "desc"})
    return todos


@router.post("/")
async def create_todo(inp: TodoIn, user_id: str = Depends(get_current_user)):
    todo = await prisma.todo.create(
        data={
            "title": inp.title,
            "userId": user_id
        }
    )
    return todo


@router.patch("/{todo_id}")
async def update_todo(todo_id: str, inp: TodoUpdateIn, user_id: str = Depends(get_current_user)):
    # Check if todo exists and belongs to user
    existing = await prisma.todo.find_first(where={"id": todo_id, "userId": user_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Not found")
    
    update_data = {}
    if inp.completed is not None:
        update_data["completed"] = inp.completed
    if inp.title is not None:
        update_data["title"] = inp.title
    
    todo = await prisma.todo.update(
        where={"id": todo_id},
        data=update_data
    )
    return todo


@router.delete("/{todo_id}")
async def delete_todo(todo_id: str, user_id: str = Depends(get_current_user)):
    existing = await prisma.todo.find_first(where={"id": todo_id, "userId": user_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Not found")
    
    await prisma.todo.delete(where={"id": todo_id})
    return {"ok": True}

