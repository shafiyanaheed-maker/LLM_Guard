"""
Red-Team Simulator — Auth & Session Security Tests
====================================================

Tests the guard API's authentication/authorization boundaries directly --
separate from prompt-content attacks. This checks things like:
  - Does /prompt work WITHOUT a token? (should be blocked)
  - Does it accept an obviously invalid/garbage token?
  - Does it accept an empty Authorization header?
  - Does it leak useful info in auth error messages?

Run it with (server must be running):
  python runner/auth_security_tests.py
"""

import json
import os
import sys
import requests
from datetime import datetime, timezone

sys.path.append(os.path.dirname(__file__))
import config

RESULTS_DIR = os.path.join(os.path.dirname(__file__), "..", "results")


def get_valid_token():
    """Get a real token first, so we have a baseline to compare against."""
    payload = {"username": config.LOGIN_USERNAME, "password": config.LOGIN_PASSWORD}
    resp = requests.post(config.LOGIN_URL, json=payload, timeout=config.TIMEOUT)
    resp.raise_for_status()
    return resp.json().get("access_token")


def try_request(description, headers, payload=None):
    """Send one auth test request and record what happened."""
    if payload is None:
        payload = {"username": config.PROMPT_USERNAME, "prompt": "hello"}
    try:
        resp = requests.post(config.TARGET_URL, json=payload, headers=headers, timeout=config.TIMEOUT)
        try:
            body = resp.json()
        except ValueError:
            body = resp.text[:300]  # truncate raw HTML/text bodies
        return {
            "test": description,
            "status_code": resp.status_code,
            "response": body,
        }
    except requests.RequestException as e:
        return {"test": description, "status_code": None, "response": f"ERROR: {e}"}


def run():
    print("Getting a valid token as baseline...")
    valid_token = get_valid_token()
    print("Got token. Running auth security tests...\n")

    tests = []

    # Test 1: No Authorization header at all
    tests.append(try_request(
        "No Authorization header",
        headers={"Content-Type": "application/json"},
    ))

    # Test 2: Empty Bearer token
    tests.append(try_request(
        "Empty Bearer token",
        headers={"Content-Type": "application/json", "Authorization": "Bearer "},
    ))

    # Test 3: Garbage/random token
    tests.append(try_request(
        "Garbage random token",
        headers={"Content-Type": "application/json", "Authorization": "Bearer abc123notarealtoken"},
    ))

    # Test 4: Malformed JWT-looking token (structurally wrong)
    tests.append(try_request(
        "Malformed JWT structure",
        headers={"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.fake.signature"},
    ))

    # Test 5: Wrong auth scheme (Basic instead of Bearer)
    tests.append(try_request(
        "Wrong auth scheme (Basic instead of Bearer)",
        headers={"Content-Type": "application/json", "Authorization": f"Basic {valid_token}"},
    ))

    # Test 6: Valid token but tampered (last few chars changed) -- checks signature validation
    tampered = valid_token[:-5] + "XXXXX" if valid_token else "XXXXX"
    tests.append(try_request(
        "Valid token with tampered signature",
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {tampered}"},
    ))

    # Test 7: Valid token, but as a different case ("bearer" lowercase)
    tests.append(try_request(
        "Lowercase 'bearer' scheme",
        headers={"Content-Type": "application/json", "Authorization": f"bearer {valid_token}"},
    ))

    # Test 8: Baseline -- valid token, should succeed (sanity check)
    tests.append(try_request(
        "BASELINE: valid token (should succeed)",
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {valid_token}"},
    ))

    print(f"{'Test':45s} | Status | Notes")
    print("-" * 100)
    for t in tests:
        note = ""
        if t["status_code"] == 200 and "valid token" not in t["test"].lower() and "baseline" not in t["test"].lower():
            note = "⚠️  POTENTIAL VULNERABILITY: request succeeded without valid auth!"
        print(f"{t['test']:45s} | {str(t['status_code']):6s} | {note}")

    os.makedirs(RESULTS_DIR, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    out_path = os.path.join(RESULTS_DIR, f"auth_test_{timestamp}.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"run_timestamp": timestamp, "tests": tests}, f, indent=2)

    print(f"\nSaved detailed results to {out_path}")
    return out_path


if __name__ == "__main__":
    run()
