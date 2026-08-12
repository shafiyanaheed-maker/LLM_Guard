from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.auth import create_access_token, authenticate_user

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(user: LoginRequest):
    """
    Authenticate user and return a JWT access token.
    """

    if not authenticate_user(user.username, user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    token = create_access_token({
        "sub": user.username
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }