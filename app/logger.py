from app.database import get_connection


def log_request(
    username,
    role,
    prompt,
    status,
    prompt_injection_detected=0,
    detected_patterns="",
    risk_score=0,
    risk_level="",
    ml_threat_detected=0,
    ml_confidence=0.0
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO request_logs
        (
            username,
            role,
            prompt,
            status,
            prompt_injection_detected,
            detected_patterns,
            risk_score,
            risk_level,
            ml_threat_detected,
            ml_confidence
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            username,
            role,
            prompt,
            status,
            prompt_injection_detected,
            detected_patterns,
            risk_score,
            risk_level,
            ml_threat_detected,
            ml_confidence
        )
    )

    conn.commit()
    conn.close()


def log_blocked_prompt(prompt, reason):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO blocked_logs
        (prompt, reason)
        VALUES (?, ?)
        """,
        (prompt, reason)
    )

    conn.commit()
    conn.close()
def log_dlp_detection(
    username: str,
    role: str,
    detected_entities: list
):
    """
    Log DLP detections for security monitoring.
    """

    if not detected_entities:
        return

    import json
    from datetime import datetime

    event = {
        "event": "DLP_DETECTION",
        "username": username,
        "role": role,
        "detected_entities": detected_entities,
        "timestamp": datetime.utcnow().isoformat()
    }

    print(json.dumps(event))