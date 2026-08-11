"""
Configuration for the Red-Team Simulator.

Edit these values to match how your teammates' guard system actually works.
Talk to whoever owns proxy.py / routes.py / main.py to confirm:
  1. What endpoint receives a raw prompt (TARGET_URL)
  2. What JSON key the prompt goes in (PROMPT_FIELD)
  3. How you know a prompt was BLOCKED vs ALLOWED (see attack_runner.py -> is_blocked())
"""

import os

# The endpoint your guard system exposes to test prompts against.
# Example if it's a local FastAPI/Flask server: "http://127.0.0.1:8000/chat"
TARGET_URL = os.environ.get("RTS_TARGET_URL", "http://127.0.0.1:8000/api/chat")

# Some setups protect this endpoint with an API key (see api_key.py in your repo).
API_KEY = os.environ.get("RTS_API_KEY", "")

# JSON field name the target API expects the prompt in.
PROMPT_FIELD = "message"

# Request timeout in seconds.
TIMEOUT = 15

# How many times to retry a failed request before marking it as an error.
MAX_RETRIES = 2
