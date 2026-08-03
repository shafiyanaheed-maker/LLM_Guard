from app.database import get_connection


def log_request(
    username,
    role,
    prompt,
    status,
    prompt_injection_detected=0,
    detected_patterns="",
    risk_score=0,
    risk_level=""
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
            risk_level
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            username,
            role,
            prompt,
            status,
            prompt_injection_detected,
            detected_patterns,
            risk_score,
            risk_level
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