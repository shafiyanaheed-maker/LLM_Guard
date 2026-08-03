VALID_API_KEYS = {
    "admin-api-key": "admin",
    "employee-api-key": "employee",
    "intern-api-key": "intern"
}


def validate_api_key(api_key: str):
    return VALID_API_KEYS.get(api_key)