from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.auth import create_access_token

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(user: LoginRequest):
    """
    Simple login endpoint.
    Replace this with SQLite verification later.
    """

    if user.username == "admin" and user.password == "admin123":
        token = create_access_token({"sub": user.username})

        return {
            "access_token": token,
            "token_type": "bearer"
        }

    raise HTTPException(
        status_code=401,
        detail="Invalid username or password"
    )