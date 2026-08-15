"""
Red-Team Simulator — Error Handling & Information Disclosure Tests
=====================================================================

Checks whether the API leaks sensitive internal details (stack traces, file
paths, library versions) when given malformed/unexpected input. This is
DIFFERENT from prompt-content attacks -- it's about how the API *fails*, not
what it lets through.

We already found ONE real example of this manually: an early bug (missing DB
table) caused a raw Python traceback to be returned in the response body,
including full local file paths like C:\\Users\\...\\LLM_Guard\\app\\routes.py.
That is a real information-disclosure vulnerability worth reporting even
though the immediate cause (missing table) has been fixed.

Run it with (server must be running, valid token required):
  python runner/error_handling_tests.py
"""

import json
import os
import sys
import requests
from datetime import datetime, timezone

sys.path.append(os.path.dirname(__file__))
import config

RESULTS_DIR = os.path.join(os.path.dirname(__file__), "..", "results")

# Signals that a response is leaking internal implementation details.
LEAK_INDICATORS = [
    "traceback", "file \"c:\\", "file \"/", ".py\", line", "site-packages",
    "sqlite3.", "internal server error", "raise exc", "exception", "stack trace",
]


def get_valid_token():
    payload = {"username": config.LOGIN_USERNAME, "password": config.LOGIN_PASSWORD}
    resp = requests.post(config.LOGIN_URL, json=payload, timeout=config.TIMEOUT)
    resp.raise_for_status()
    return resp.json().get("access_token")


def try_request(description, payload, token, raw_body=False):
    headers = {"Authorization": f"Bearer {token}"}
    if not raw_body:
        headers["Content-Type"] = "application/json"
    try:
        if raw_body:
            resp = requests.post(config.TARGET_URL, data=payload, headers=headers, timeout=config.TIMEOUT)
        else:
            resp = requests.post(config.TARGET_URL, json=payload, headers=headers, timeout=config.TIMEOUT)
        body_text = resp.text
        try:
            body = resp.json()
        except ValueError:
            body = body_text[:1000]

        leaked = any(ind in body_text.lower() for ind in LEAK_INDICATORS)
        return {
            "test": description,
            "status_code": resp.status_code,
            "possible_info_leak": leaked,
            "response_preview": body if isinstance(body, dict) else str(body)[:500],
        }
    except requests.RequestException as e:
        return {"test": description, "status_code": None, "possible_info_leak": False, "response_preview": f"ERROR: {e}"}


def run():
    print("Getting valid token...")
    token = get_valid_token()
    print("Running error-handling / info-disclosure tests...\n")

    tests = []

    # Missing required field entirely
    tests.append(try_request("Missing 'prompt' field", {"username": "guest"}, token))

    # Wrong data type for prompt (should be string, send a number)
    tests.append(try_request("Wrong type: prompt as integer", {"username": "guest", "prompt": 12345}, token))

    # Wrong data type for prompt (send a list)
    tests.append(try_request("Wrong type: prompt as array", {"username": "guest", "prompt": ["a", "b"]}, token))

    # Missing username field
    tests.append(try_request("Missing 'username' field", {"prompt": "hello"}, token))

    # Completely malformed JSON body (raw, not valid JSON)
    tests.append(try_request("Malformed JSON body", "{not valid json!!", token, raw_body=True))

    # Extremely large payload (mild -- ~50k characters, not a full DoS test)
    tests.append(try_request("Very large prompt (~50k chars)", {"username": "guest", "prompt": "A" * 50000}, token))

    # Extra unexpected fields (checking for mass-assignment style issues)
    tests.append(try_request(
        "Unexpected extra fields (role escalation attempt)",
        {"username": "guest", "prompt": "hello", "role": "admin", "is_admin": True},
        token,
    ))

    # Null values
    tests.append(try_request("Null prompt value", {"username": "guest", "prompt": None}, token))

    print(f"{'Test':50s} | Status | Info Leak?")
    print("-" * 90)
    for t in tests:
        flag = "⚠️  YES - CHECK THIS" if t["possible_info_leak"] else "No"
        print(f"{t['test']:50s} | {str(t['status_code']):6s} | {flag}")

    os.makedirs(RESULTS_DIR, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    out_path = os.path.join(RESULTS_DIR, f"error_handling_test_{timestamp}.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"run_timestamp": timestamp, "tests": tests}, f, indent=2)

    print(f"\nSaved detailed results to {out_path}")
    print("\nNOTE: This does not include the earlier manually-found stack-trace leak")
    print("(missing 'request_logs' table). Document that one manually in your report --")
    print("it's a real, already-confirmed finding even though it's now fixed.")
    return out_path


if __name__ == "__main__":
    run()
