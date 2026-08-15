import json

with open("data/blocked_keywords.json", "r") as file:
    BLOCKED_KEYWORDS = json.load(file)

# Additional firewall rules
EXTRA_BLOCKED = [
    "ignore previous instructions",
    "forget previous instructions",
    "system prompt",
    "show your system prompt",
    "reveal your instructions",
    "developer mode",
    "do anything now",
    "dan",
    "jailbreak",
    "bypass",
    "override",
    "disable firewall",
    "act as root",
    "simulate admin",
    "reveal api key",
    "show password",
    "dump database"
]


def check_prompt_length(prompt: str, max_length: int):

    if len(prompt) > max_length:
        return False, f"Prompt exceeds your limit ({max_length} characters)"

    return True, "Prompt length is valid"


def check_prompt(prompt: str, role: str):

    prompt = prompt.lower()

    blocked = BLOCKED_KEYWORDS.get(role, [])

    # Existing blocked keywords
    for keyword in blocked:
        if keyword.lower() in prompt:
            return False, f"Blocked keyword: {keyword}"

    # Extra firewall rules
    for keyword in EXTRA_BLOCKED:
        if keyword in prompt:
            return False, f"Firewall blocked suspicious prompt: {keyword}"

    return True, "Prompt is safe"