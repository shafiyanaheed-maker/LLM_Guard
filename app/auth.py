from datetime import datetime, timedelta

import bcrypt
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
# User Authentication
# ==========================

USERS = {
    "admin": {
        "password_hash": "$2b$12$OPuYkeNG70v/GmHF8Rq0M.ORFEGk16M9CsF3V/66n0Lmlaop.4/dS",
        "role": "Admin",
        "max_prompt_length": 5000,
    },
    "analyst": {
        "password_hash": "$2b$12$NApWJNgkfYZrRlA8Y8Hhp.Tkc.wzBM2gcv9dur4S2fsewTR04jJyK",
        "role": "Analyst",
        "max_prompt_length": 3000,
    },
    "guest": {
        "password_hash": "$2b$12$ReEy7MVaFgFbBSp.oMkR/uGR.AYNFvuZGp0F7MGnUDKIuvEtpOqNS",
        "role": "Guest",
        "max_prompt_length": 1000,
    },
}


def authenticate_user(username: str, password: str):
    """
    Validate username and password using bcrypt.
    """

    user = USERS.get(username)

    if not user:
        return False

    return bcrypt.checkpw(
        password.encode("utf-8"),
        user["password_hash"].encode("utf-8")
    )


# ==========================
# User Role
# ==========================

def get_user_role(username: str):
    """
    Return the user's role.
    """

    user = USERS.get(username)

    if user:
        return user["role"]

    return None


# ==========================
# Prompt Length
# ==========================

def get_max_prompt_length(username: str):
    """
    Return the maximum prompt length allowed.
    """

    user = USERS.get(username)

    if user:
        return user["max_prompt_length"]

    return 500