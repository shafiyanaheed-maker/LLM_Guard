from datetime import datetime, timedelta
from jose import jwt

# ==========================
# JWT Configuration
# ==========================

SECRET_KEY = "llm_guard_secret_key_2026"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict):
    """
    Create a JWT access token.
    """
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
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