from datetime import datetime, timedelta
from jose import jwt

from app.config import (
    JWT_SECRET_KEY,
    JWT_ALGORITHM,
    JWT_EXPIRE_MINUTES,
)


# ==========================
# JWT Configuration
# ==========================

def create_access_token(data: dict):
    """
    Create a JWT access token.
    """
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=JWT_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )


# ==========================
# Existing Authentication Helpers
# ==========================

USERS = {
    "admin": {
        "password": "admin123",
        "role": "Admin",
        "max_prompt_length": 5000,
    },
    "analyst": {
        "password": "analyst123",
        "role": "Analyst",
        "max_prompt_length": 3000,
    },
    "guest": {
        "password": "guest123",
        "role": "Guest",
        "max_prompt_length": 1000,
    },
}


def authenticate_user(username: str, password: str):
    """
    Validate username and password.
    """
    user = USERS.get(username)

    if user and user["password"] == password:
        return True

    return False


def get_user_role(username: str):
    """
    Return the user's role.
    """
    user = USERS.get(username)

    if user:
        return user["role"]

    return None


def get_max_prompt_length(username: str):
    """
    Return the maximum prompt length allowed.
    """
    user = USERS.get(username)

    if user:
        return user["max_prompt_length"]

    return 500