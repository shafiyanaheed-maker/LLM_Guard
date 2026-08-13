"""
Configuration for the Red-Team Simulator — now wired to the REAL LLM_Guard API.

Confirmed from teammate + Swagger UI (/docs):
  - Login:  POST http://127.0.0.1:8000/login   body: {"username": "admin", "password": "admin123"}
            response: {"access_token": "...", "token_type": "bearer"}
  - Prompt: POST http://127.0.0.1:8000/prompt   body: {"username": "guest", "prompt": "..."}
            auth:   Authorization: Bearer <access_token>

If your teammate changes any of this later, this is the only file you should
need to touch (plus is_blocked() in attack_runner.py if the block signal changes).
"""

import os

# --- Base server ---
BASE_URL = os.environ.get("RTS_BASE_URL", "http://127.0.0.1:8000")

# --- Login (to obtain a bearer token) ---
LOGIN_URL = f"{BASE_URL}/login"
LOGIN_USERNAME = os.environ.get("RTS_LOGIN_USERNAME", "admin")
LOGIN_PASSWORD = os.environ.get("RTS_LOGIN_PASSWORD", "admin123")

# --- Prompt (the actual attack target) ---
TARGET_URL = f"{BASE_URL}/prompt"

# The "username" field sent along with every attack prompt.
# (Separate from the login username — this is whoever is "asking" the prompt.)
PROMPT_USERNAME = os.environ.get("RTS_PROMPT_USERNAME", "guest")

# JSON field name the target API expects the prompt text in.
PROMPT_FIELD = "prompt"

# Request timeout in seconds.
TIMEOUT = 15

# How many times to retry a failed request before marking it as an error.
MAX_RETRIES = 2
