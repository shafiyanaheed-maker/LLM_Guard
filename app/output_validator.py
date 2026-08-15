import re
from typing import List, Tuple

from app.dlp import PATTERNS


def validate_output(response: str) -> Tuple[str, List[str]]:
    """
    Validate an LLM response for sensitive-data leakage.

    Uses the same DLP patterns as input sanitization so that
    input and output protection remain consistent.

    Returns:
        sanitized_response: Redacted LLM response
        issues: Detected leakage categories
    """

    sanitized_response = response
    issues: List[str] = []

    for name, pattern, replacement in PATTERNS:

        if re.search(pattern, sanitized_response):

            issues.append(f"{name} Leakage")

            sanitized_response = re.sub(
                pattern,
                replacement,
                sanitized_response
            )

    # Detect system-prompt disclosure separately.
    system_prompt_pattern = r"\bsystem\s+prompt\b"

    if re.search(
        system_prompt_pattern,
        sanitized_response,
        re.IGNORECASE
    ):
        issues.append("System Prompt Disclosure")

        sanitized_response = re.sub(
            system_prompt_pattern,
            "[SYSTEM_PROMPT_REDACTED]",
            sanitized_response,
            flags=re.IGNORECASE
        )

    return sanitized_response, issues