from typing import List

def generate_threat_report(
    detected_patterns: List[str],
    risk_score: int,
    risk_level: str
):

    if risk_score >= 80:
        recommendation = "Block request immediately"

    elif risk_score >= 50:
        recommendation = "Flag for security review"

    else:
        recommendation = "Monitor request"

    return {
        "threat_types": detected_patterns,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "severity": risk_level,
        "recommendation": recommendation
    }