import re


def sanitize_prompt(prompt: str):
    detected = []

    patterns = [
        ("Email",
         r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
         "[EMAIL]"),

        ("Phone Number",
         r"\b\d{10}\b",
         "[PHONE]"),

        ("Credit Card",
         r"\b(?:\d{4}[- ]?){3}\d{4}\b|\b\d{13,16}\b",
         "[CREDIT_CARD]"),

        ("OpenAI API Key",
         r"sk-[A-Za-z0-9]{10,}",
         "[OPENAI_API_KEY]"),

        ("IPv4 Address",
         r"\b(?:\d{1,3}\.){3}\d{1,3}\b",
         "[IP_ADDRESS]"),

        ("Aadhaar Number",
         r"\b\d{4}\s?\d{4}\s?\d{4}\b",
         "[AADHAAR]"),

        ("PAN Card",
         r"\b[A-Z]{5}[0-9]{4}[A-Z]\b",
         "[PAN]"),

        ("Passport Number",
         r"\b[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]\b",
         "[PASSPORT]"),

        ("AWS Access Key",
         r"\bAKIA[0-9A-Z]{16}\b",
         "[AWS_ACCESS_KEY]"),

        ("GitHub Token",
         r"\bghp_[A-Za-z0-9]{36}\b",
         "[GITHUB_TOKEN]"),

        ("Google API Key",
         r"\bAIza[0-9A-Za-z\-_]{35}\b",
         "[GOOGLE_API_KEY]"),

        ("JWT Token",
         r"eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+",
         "[JWT_TOKEN]")
    ]

    for name, pattern, replacement in patterns:
        if re.search(pattern, prompt):
            detected.append(name)
            prompt = re.sub(pattern, replacement, prompt)

    return prompt, detected