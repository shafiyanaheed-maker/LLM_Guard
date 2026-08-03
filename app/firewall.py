import json

with open("data/blocked_keywords.json", "r") as file:
    BLOCKED_KEYWORDS = json.load(file)


def check_prompt_length(prompt: str, max_length: int):

    if len(prompt) > max_length:
        return False, f"Prompt exceeds your limit ({max_length} characters)"

    return True, "Prompt length is valid"


def check_prompt(prompt: str, role: str):

    prompt = prompt.lower()

    blocked = BLOCKED_KEYWORDS.get(role, [])

    for keyword in blocked:
        if keyword in prompt:
            return False, f"Blocked keyword: {keyword}"

    return True, "Prompt is safe"