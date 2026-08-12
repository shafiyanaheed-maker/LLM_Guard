import json
import os
from datetime import datetime
from app.database import get_connection


LOG_DIR = "logs"
SIEM_LOG_FILE = os.path.join(LOG_DIR, "siem_events.jsonl")


def _ensure_log_directory():
    os.makedirs(LOG_DIR, exist_ok=True)


def _write_siem_event(event):
    _ensure_log_directory()

    with open(
        SIEM_LOG_FILE,
        "a",
        encoding="utf-8"
    ) as file:
        file.write(
            json.dumps(
                event,
                ensure_ascii=False
            )
            + "\n"
        )


def log_security_event(
    username,
    role,
    prompt,
    status,
    risk_score=0,
    risk_level="Low",
    prompt_injection_detected=False,
    detected_patterns=None,
    ml_threat_detected=False,
    ml_confidence=0,
    ml_label=None,
    dlp_detected=None,
    rule_triggered=None
):
    """
    Create a structured security event suitable for SIEM ingestion.
    """

    event = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "service": "LLM-Guard",
        "event_type": "LLM_SECURITY_EVENT",
        "user": {
            "username": username,
            "role": role
        },
        "request": {
            "prompt": prompt,
            "status": status
        },
        "threat_detection": {
            "prompt_injection_detected": bool(
                prompt_injection_detected
            ),
            "detected_patterns": detected_patterns or [],
            "ml_threat_detected": bool(
                ml_threat_detected
            ),
            "ml_confidence": ml_confidence,
            "ml_label": ml_label
        },
        "risk": {
            "score": risk_score,
            "level": risk_level
        },
        "dlp": {
            "detected_entities": dlp_detected or [],
            "entity_count": len(dlp_detected or [])
        },
        "firewall": {
            "rule_triggered": rule_triggered
        }
    }

    _write_siem_event(event)

    return event


def log_request(
    username,
    role,
    prompt,
    status,
    prompt_injection_detected=0,
    detected_patterns="",
    risk_score=0,
    risk_level="Low",
    ml_threat_detected=0,
    ml_confidence=0,
    dlp_detected=None,
    rule_triggered=None
):
    """
    Store the request in the application database and
    generate a SIEM-compatible security event.
    """

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO request_logs (
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

    pattern_list = []

    if detected_patterns:
        if isinstance(detected_patterns, str):
            pattern_list = [
                item.strip()
                for item in detected_patterns.split(",")
                if item.strip()
            ]
        else:
            pattern_list = detected_patterns

    return log_security_event(
        username=username,
        role=role,
        prompt=prompt,
        status=status,
        risk_score=risk_score,
        risk_level=risk_level,
        prompt_injection_detected=bool(
            prompt_injection_detected
        ),
        detected_patterns=pattern_list,
        ml_threat_detected=bool(
            ml_threat_detected
        ),
        ml_confidence=ml_confidence,
        dlp_detected=dlp_detected,
        rule_triggered=rule_triggered
    )


def log_blocked_prompt(
    prompt,
    reason,
    username="system",
    role="Unknown"
):
    """
    Store blocked firewall activity.
    """

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO blocked_logs (
            prompt,
            reason
        )
        VALUES (?, ?)
        """,
        (
            prompt,
            reason
        )
    )

    conn.commit()
    conn.close()

    return log_security_event(
        username=username,
        role=role,
        prompt=prompt,
        status="Blocked",
        rule_triggered=reason
    )