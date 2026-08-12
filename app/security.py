from jose import JWTError, jwt
from fastapi import HTTPException

from app.config import JWT_SECRET_KEY, JWT_ALGORITHM


def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )

        username = payload.get("sub")

        if username is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        return username

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )


def require_role(username: str, allowed_roles: list):
    """
    Check whether the authenticated user has permission
    to access a resource.
    """

    from app.auth import get_user_role

    role = get_user_role(username)

    if role is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid user"
        )

    if role not in allowed_roles:
        raise HTTPException(
            status_code=403,
            detail="Access denied for your role"
        )

    return role
