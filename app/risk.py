def calculate_risk(prompt: str, role: str):
    prompt = prompt.lower()

    score = 0

    # Risk keywords with different weights
    risky_keywords = {
        "ignore previous instructions": 30,
        "forget previous instructions": 30,
        "developer mode": 25,
        "jailbreak": 30,
        "system prompt": 25,
        "override": 20,
        "disable safety": 30,
        "bypass": 20,
        "act as root": 30,
        "pretend to be": 20,
        "reveal api key": 35,
        "show credentials": 35,
        "dump database": 40,
        "show password": 35,
        "ignore all rules": 30,
        "do anything now": 30
    }

    # Calculate score based on detected keywords
    for keyword, weight in risky_keywords.items():
        if keyword in prompt:
            score += weight

    # Long prompts are slightly more suspicious
    if len(prompt) > 300:
        score += 10

    # Intern users get a slightly higher risk score
    if role == "Intern":
        score += 10

    # Maximum score is 100
    score = min(score, 100)

    # Assign risk level
    if score >= 80:
        level = "Critical"
    elif score >= 60:
        level = "High"
    elif score >= 30:
        level = "Medium"
    else:
        level = "Low"

    return score, level