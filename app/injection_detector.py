import re

PATTERNS = {
    "Prompt Injection": [
        r"ignore\s+(all\s+)?previous\s+instructions",
        r"forget\s+(all\s+)?previous\s+instructions",
        r"disregard\s+(all\s+)?previous\s+(instructions|rules)",
        r"ignore\s+(all\s+)?prior\s+(instructions|rules)",
        r"override\s+(the\s+)?system\s+(instructions|rules)",
        r"bypass\s+(the\s+)?instructions",
        r"ignore\s+the\s+above",
    ],

    "System Prompt Leakage": [
        r"system\s+prompt",
        r"show\s+(me\s+)?your\s+system\s+prompt",
        r"reveal\s+(your\s+)?system\s+prompt",
        r"print\s+(your\s+)?system\s+instructions",
        r"reveal\s+(your\s+)?instructions",
        r"show\s+(me\s+)?your\s+instructions",
    ],

    "Jailbreak Attempt": [
        r"developer\s+mode",
        r"do\s+anything\s+now",
        r"\bdan\b",
        r"jailbreak",
        r"remove\s+(all\s+)?restrictions",
        r"disable\s+(all\s+)?safety",
        r"bypass\s+safety",
    ],

    "Role Manipulation": [
        r"you\s+are\s+now",
        r"pretend\s+to\s+be",
        r"act\s+as",
        r"roleplay\s+as",
        r"behave\s+like",
        r"simulate\s+being",
    ],

    "Data Exfiltration": [
        r"reveal\s+(the\s+)?api\s+key",
        r"show\s+(the\s+)?password",
        r"dump\s+(the\s+)?database",
        r"show\s+(the\s+)?credentials",
        r"export\s+(all\s+)?user\s+data",
        r"reveal\s+secret(s)?",
    ],
}

def detect_prompt_injection(prompt: str):
    detected = []
    prompt_lower = prompt.lower()

    for category, rules in PATTERNS.items():
        for rule in rules:
            if re.search(rule, prompt_lower):
                detected.append({
                    "category": category,
                    "pattern": rule
                })
                break

    return len(detected) > 0, detected