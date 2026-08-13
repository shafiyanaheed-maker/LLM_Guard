import re

PATTERNS = {

    "Prompt Injection": [
        r"ignore\s+previous\s+instructions",
        r"forget\s+everything",
        r"ignore\s+all\s+earlier\s+instructions",
        r"disregard\s+system\s+directions",
        r"override\s+your\s+rules",
        r"override\s+instructions"
    ],

    "System Prompt Leakage": [
        r"system\s+prompt",
        r"show\s+your\s+system\s+prompt",
        r"reveal\s+your\s+instructions",
        r"hidden\s+prompt",
        r"internal\s+prompt",
        r"print\s+initial\s+instructions",
        r"repeat\s+your\s+setup\s+prompt",
        r"show\s+hidden\s+message"
    ],

    "Jailbreak Attempt": [
        r"developer\s+mode",
        r"do\s+anything\s+now",
        r"\bdan\b",
        r"d\.a\.n",
        r"unrestricted\s+gpt",
        r"disable\s+safety",
        r"answer\s+without\s+restrictions",
        r"no\s+ethical\s+guidelines"
    ],

    "Role Manipulation": [
        r"you\s+are\s+now",
        r"pretend\s+to\s+be",
        r"act\s+as",
        r"simulate\s+admin",
        r"act\s+as\s+root",
        r"you\s+are\s+now\s+administrator",
        r"assume\s+role\s+of\s+security\s+admin"
    ],

    "Data Exfiltration": [
        r"reveal\s+api\s+key",
        r"show\s+password",
        r"dump\s+database",
        r"show\s+credentials",
        r"secret\s+key",
        r"private\s+key",
        r"show\s+jwt",
        r"export\s+all\s+records",
        r"print\s+environment\s+variables",
        r"reveal\s+secrets"
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

    return len(detected) > 0, detected