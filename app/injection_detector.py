import re

PATTERNS = {
    "Prompt Injection": [
        r"ignore\s+previous\s+instructions",
        r"forget\s+previous\s+instructions",
        r"disregard\s+all\s+previous",
    ],

    "System Prompt Leakage": [
        r"system\s+prompt",
        r"show\s+your\s+system\s+prompt",
        r"reveal\s+your\s+instructions",
    ],

    "Jailbreak Attempt": [
        r"developer\s+mode",
        r"do\s+anything\s+now",
        r"\bDAN\b",
        r"jailbreak",
    ],

    "Role Manipulation": [
        r"you\s+are\s+now",
        r"pretend\s+to\s+be",
        r"act\s+as",
    ],

    "Data Exfiltration": [
        r"reveal\s+api\s+key",
        r"show\s+password",
        r"dump\s+database",
        r"show\s+credentials",
    ]
}


def detect_prompt_injection(prompt: str):

    detected = []

    prompt_lower = prompt.lower()

    for category, rules in PATTERNS.items():

        for rule in rules:

            if re.search(rule, prompt_lower):

                detected.append(category)

                break

    return (
        len(detected) > 0,
        detected
    )