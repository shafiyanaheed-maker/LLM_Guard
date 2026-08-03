from datetime import datetime, timedelta

user_requests = {}


def check_rate_limit(username: str, limit: int = 5, window: int = 60):
    now = datetime.now()

    if username not in user_requests:
        user_requests[username] = []

    # Keep only requests within the time window
    user_requests[username] = [
        t for t in user_requests[username]
        if now - t < timedelta(seconds=window)
    ]

    if len(user_requests[username]) >= limit:
        return False

    user_requests[username].append(now)
    return True