"""
Red-Team Simulator — Automated Attack Runner
=============================================

What this does:
  1. Loads the adversarial prompt dataset (data/adversarial_prompts.json)
  2. Sends every prompt to your team's guard/firewall API (config.py)
  3. Decides whether each attack was BLOCKED or GOT THROUGH
  4. Saves per-prompt results + a summary to results/run_<timestamp>.json

Run it with:
  python runner/attack_runner.py

You MUST confirm with your teammate (whoever owns proxy.py/firewall.py) how
their system signals a block, then edit is_blocked() below to match it.
By default it supports THREE common patterns — HTTP status code, a JSON
"blocked" field, and keyword matching in the response text — try them and
keep/remove whichever applies to your system.
"""

import json
import os
import sys
import time
import requests
from datetime import datetime, timezone

sys.path.append(os.path.dirname(__file__))
import config

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "adversarial_prompts.json")
RESULTS_DIR = os.path.join(os.path.dirname(__file__), "..", "results")

# Phrases that typically indicate a guard/firewall blocked the request.
# Edit this list to match the actual block message your teammates use
# (check blocked_keywords.json / firewall.py in the main repo).
BLOCK_INDICATOR_PHRASES = [
    "blocked", "request denied", "violates policy", "cannot comply",
    "flagged", "not allowed", "security policy", "rejected",
]


def load_dataset():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def send_prompt(prompt_text: str):
    """Send a single prompt to the target guard system and return (status_code, response_json_or_text)."""
    headers = {"Content-Type": "application/json"}
    if config.API_KEY:
        headers["Authorization"] = f"Bearer {config.API_KEY}"

    payload = {config.PROMPT_FIELD: prompt_text}

    last_error = None
    for attempt in range(config.MAX_RETRIES + 1):
        try:
            resp = requests.post(
                config.TARGET_URL, json=payload, headers=headers, timeout=config.TIMEOUT
            )
            try:
                body = resp.json()
            except ValueError:
                body = resp.text
            return resp.status_code, body
        except requests.RequestException as e:
            last_error = str(e)
            time.sleep(1)
    return None, f"ERROR: could not reach target after retries: {last_error}"


def is_blocked(status_code, body) -> bool:
    """
    Decide whether the guard system blocked this attack.
    Adjust this function to match your team's actual API contract.
    """
    # Pattern 1: explicit HTTP status codes commonly used for blocking
    if status_code in (403, 400, 451):
        return True

    # Pattern 2: JSON response with an explicit boolean/field
    if isinstance(body, dict):
        for key in ("blocked", "is_blocked", "flagged", "denied"):
            if key in body and body[key] in (True, "true", "True", 1):
                return True
        # some guards return a "status" field
        if str(body.get("status", "")).lower() in ("blocked", "denied", "rejected"):
            return True

    # Pattern 3: keyword match in text response
    text = json.dumps(body).lower() if isinstance(body, (dict, list)) else str(body).lower()
    return any(phrase in text for phrase in BLOCK_INDICATOR_PHRASES)


def run():
    dataset = load_dataset()
    prompts = dataset["prompts"]
    results = []

    print(f"Loaded {len(prompts)} adversarial prompts. Target: {config.TARGET_URL}\n")

    for i, item in enumerate(prompts, 1):
        status_code, body = send_prompt(item["prompt"])
        blocked = is_blocked(status_code, body) if status_code is not None else None
        outcome = "ERROR" if status_code is None else ("BLOCKED" if blocked else "GOT THROUGH")

        results.append({
            "id": item["id"],
            "category": item["category"],
            "technique": item["technique"],
            "severity": item["severity"],
            "prompt": item["prompt"],
            "status_code": status_code,
            "outcome": outcome,
            "raw_response": body,
        })

        print(f"[{i}/{len(prompts)}] {item['id']:8s} ({item['category']:24s}) -> {outcome}")

    os.makedirs(RESULTS_DIR, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    out_path = os.path.join(RESULTS_DIR, f"run_{timestamp}.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"run_timestamp": timestamp, "target": config.TARGET_URL, "results": results}, f, indent=2)

    print(f"\nSaved results to {out_path}")
    return out_path


if __name__ == "__main__":
    run()
