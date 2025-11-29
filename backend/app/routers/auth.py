# app/routers/auth.py

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr
import bcrypt
import hashlib
from jose import jwt
from datetime import datetime, timedelta
from fastapi import status
from app.prisma_client import prisma
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
import os

router = APIRouter()


def hash_password(password: str) -> str:
    """Hash password using bcrypt. Pre-hash with SHA256 if > 72 bytes."""
    password_bytes = password.encode('utf-8')
    # bcrypt has a 72-byte limit, so pre-hash long passwords
    if len(password_bytes) > 72:
        password_bytes = hashlib.sha256(password_bytes).hexdigest().encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    """Verify password against bcrypt hash."""
    password_bytes = password.encode('utf-8')
    # Handle pre-hashed long passwords
    if len(password_bytes) > 72:
        password_bytes = hashlib.sha256(password_bytes).hexdigest().encode('utf-8')
    try:
        return bcrypt.checkpw(password_bytes, hashed.encode('utf-8'))
    except Exception:
        return False

JWT_SECRET = os.getenv("JWT_SECRET", "supersecret")
JWT_ALGO = "HS256"
JWT_EXPIRE_MINUTES = 60 * 24 * 7


class SignupIn(BaseModel):
    email: EmailStr
    password: str
    name: str | None = None


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class GoogleLoginIn(BaseModel):
    id_token: str


def create_access_token(sub: str):
    to_encode = {"sub": sub, "exp": datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)}
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGO)


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


@router.post("/signup")
async def signup(data: SignupIn):
    existing = await prisma.user.find_unique(where={"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email exists")
    hashed = hash_password(data.password)
    user = await prisma.user.create(
        data={
            "email": data.email,
            "password": hashed,
            "name": data.name
        }
    )
    token = create_access_token(sub=user.id)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login")
async def login(data: LoginIn):
    user = await prisma.user.find_unique(where={"email": data.email})
    if not user or not user.password or not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    token = create_access_token(sub=user.id)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/google")
async def google_login(data: GoogleLoginIn):
    id_token_str = data.id_token
    if not id_token_str:
        raise HTTPException(status_code=400, detail="No id token")
    
    try:
        idinfo = id_token.verify_oauth2_token(
            id_token_str,
            grequests.Request(),
            os.getenv("GOOGLE_CLIENT_ID")
        )
        email = idinfo.get("email")
        google_id = idinfo.get("sub")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Google token: {str(e)}")
    
    user = await prisma.user.find_unique(where={"email": email})
    if not user:
        user = await prisma.user.create(
            data={
                "email": email,
                "googleId": google_id,
                "name": idinfo.get("name")
            }
        )
    elif not user.googleId:
        # Update existing user with googleId if they signed up with email first
        user = await prisma.user.update(
            where={"id": user.id},
            data={"googleId": google_id}
        )
    
    token = create_access_token(sub=user.id)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me")
async def get_me(user_id: str = Depends(get_current_user)):
    user = await prisma.user.find_unique(where={"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "createdAt": user.createdAt
    }

