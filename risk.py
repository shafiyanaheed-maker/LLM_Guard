def calculate_risk(prompt: str, role: str):

    prompt = prompt.lower()

    score = 0

    weights = {

        "ignore previous instructions": 30,
        "forget everything": 30,

        "developer mode": 40,
        "dan": 40,
        "jailbreak": 40,
        "disable safety": 40,

        "system prompt": 35,

        "act as root": 30,
        "pretend to be": 25,

        "reveal api key": 50,
        "show credentials": 50,
        "dump database": 50,
        "show password": 50,

        "show jwt": 50,
        "environment variables": 50
    }

    for keyword, weight in weights.items():

        if keyword in prompt:
            score += weight

    if len(prompt) > 300:
        score += 10

    if role == "Intern":
        score += 10

    score = min(score, 100)

    if score >= 80:
        level = "Critical"
    elif score >= 60:
        level = "High"
    elif score >= 30:
        level = "Medium"
    else:
        level = "Low"

    return score, level