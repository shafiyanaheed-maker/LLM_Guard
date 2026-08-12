import re


PATTERNS = [
    (
        "Email",
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        "[EMAIL]"
    ),
    (
        "Phone Number",
        r"\b(?:\+91[-\s]?)?[6-9]\d{9}\b",
        "[PHONE]"
    ),
    (
        "Credit Card",
        r"\b(?:\d{4}[- ]?){3}\d{4}\b|\b\d{13,16}\b",
        "[CREDIT_CARD]"
    ),
    (
        "OpenAI API Key",
        r"\bsk-[A-Za-z0-9_-]{20,}\b",
        "[OPENAI_API_KEY]"
    ),
    (
        "IPv4 Address",
        r"\b(?:\d{1,3}\.){3}\d{1,3}\b",
        "[IP_ADDRESS]"
    ),
    (
        "Aadhaar Number",
        r"\b\d{4}\s?\d{4}\s?\d{4}\b",
        "[AADHAAR]"
    ),
    (
        "PAN Card",
        r"\b[A-Z]{5}[0-9]{4}[A-Z]\b",
        "[PAN]"
    ),
    (
        "Passport Number",
        r"\b[A-Z][0-9]{7}\b",
        "[PASSPORT]"
    ),
    (
        "AWS Access Key",
        r"\bAKIA[0-9A-Z]{16}\b",
        "[AWS_ACCESS_KEY]"
    ),
    (
        "GitHub Token",
        r"\bgh[pousr]_[A-Za-z0-9_]{20,}\b",
        "[GITHUB_TOKEN]"
    ),
    (
        "Google API Key",
        r"\bAIza[0-9A-Za-z_-]{35}\b",
        "[GOOGLE_API_KEY]"
    ),
    (
        "JWT Token",
        r"\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b",
        "[JWT_TOKEN]"
    ),
]


def sanitize_prompt(prompt: str):
    """
    Detect and replace sensitive information
    before the prompt is sent to the external LLM.

    Returns:
        sanitized_prompt
        detected_entities
        replacement_map
    """

    sanitized_prompt = prompt
    detected_entities = []
    replacement_map = {}

    counter = 0

    for entity_name, pattern, replacement in PATTERNS:

        matches = list(re.finditer(pattern, sanitized_prompt))

        if not matches:
            continue

        detected_entities.append(entity_name)

        # Replace from right to left so positions remain valid
        for match in reversed(matches):
            original_value = match.group(0)

            counter += 1
            placeholder = f"{replacement[:-1]}_{counter}]"

            replacement_map[placeholder] = original_value

            sanitized_prompt = (
                sanitized_prompt[:match.start()]
                + placeholder
                + sanitized_prompt[match.end():]
            )

    return (
        sanitized_prompt,
        detected_entities,
        replacement_map
    )


def restore_sensitive_data(
    response: str,
    replacement_map: dict
):
    """
    Restore original sensitive values in the
    validated LLM response.
    """

    restored_response = response

    for placeholder, original_value in replacement_map.items():
        restored_response = restored_response.replace(
            placeholder,
            original_value
        )

    return restored_response