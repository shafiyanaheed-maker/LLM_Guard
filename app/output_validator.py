import re


def validate_output(response: str):

    issues = []

    # Email Detection
    if re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", response):
        issues.append("Email Leakage")
        response = re.sub(
            r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
            "[EMAIL]",
            response
        )

    # API Key Detection
    if re.search(r"sk-[A-Za-z0-9]{10,}", response):
        issues.append("API Key Leakage")
        response = re.sub(
            r"sk-[A-Za-z0-9]{10,}",
            "[API_KEY]",
            response
        )

    # Credit Card
    if re.search(r"\b\d{13,16}\b", response):
        issues.append("Credit Card Leakage")
        response = re.sub(
            r"\b\d{13,16}\b",
            "[CREDIT_CARD]",
            response
        )

    # System Prompt Leakage
    if "system prompt" in response.lower():
        issues.append("System Prompt Disclosure")

    return response, issues