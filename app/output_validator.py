import re


def validate_output(response: str):
    """
    Validate and sanitize an LLM response before returning it to the user.

    Returns:
        sanitized_response: str
        issues: list[str]
    """

    issues = []

    # Email Detection
    email_pattern = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"

    if re.search(email_pattern, response):
        issues.append("Email Leakage")

        response = re.sub(
            email_pattern,
            "[EMAIL]",
            response
        )

    # API Key Detection
    api_key_pattern = r"sk-[A-Za-z0-9]{10,}"

    if re.search(api_key_pattern, response):
        issues.append("API Key Leakage")

        response = re.sub(
            api_key_pattern,
            "[API_KEY]",
            response
        )

    # Credit Card Detection
    credit_card_pattern = r"\b\d{13,16}\b"

    if re.search(credit_card_pattern, response):
        issues.append("Credit Card Leakage")

        response = re.sub(
            credit_card_pattern,
            "[CREDIT_CARD]",
            response
        )

    # System Prompt Leakage
    system_prompt_pattern = r"\bsystem\s+prompt\b"

    if re.search(system_prompt_pattern, response, re.IGNORECASE):
        issues.append("System Prompt Disclosure")

        response = re.sub(
            system_prompt_pattern,
            "[SYSTEM_PROMPT_REDACTED]",
            response,
            flags=re.IGNORECASE
        )

    return response, issues