from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import RedirectResponse

from app.auth import get_user_role, get_max_prompt_length
from app.models import PromptRequest
from app.firewall import check_prompt, check_prompt_length
from app.proxy import forward_prompt
from app.logger import log_blocked_prompt, log_request
from app.risk import calculate_risk
from app.injection_detector import detect_prompt_injection
from app.rate_limiter import check_rate_limit
from app.dlp import sanitize_prompt, restore_sensitive_data
from app.security import verify_token, require_role
from app.output_validator import validate_output

from ml.detector import detect_ml_threat


router = APIRouter()
security = HTTPBearer()


@router.get("/dashboard")
def dashboard():
    return RedirectResponse(url="/dashboard/index.html")


@router.get("/health")
def health():
    return {
        "status": "UP",
        "service": "LLM-Guard",
        "version": "1.0"
    }


@router.get("/logs")
def get_logs(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    username = verify_token(token)

    require_role(
        username,
        ["Admin", "Analyst"]
    )

    from app.database import get_connection

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            username,
            role,
            prompt,
            status,
            timestamp
        FROM request_logs
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()
    conn.close()

    logs = []

    for row in rows:
        logs.append({
            "username": row[0],
            "role": row[1],
            "prompt": row[2],
            "status": row[3],
            "timestamp": row[4]
        })

    return {
        "logs": logs
    }


@router.post("/prompt")
def receive_prompt(
    request: PromptRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    # --------------------------------------------------
    # 1. Verify JWT token
    # --------------------------------------------------
    token = credentials.credentials
    username = verify_token(token)

    # --------------------------------------------------
    # 2. Rate limiting
    # --------------------------------------------------
    if not check_rate_limit(username):
        return {
            "status": "Blocked",
            "reason": "Rate limit exceeded. Try again later."
        }

    # --------------------------------------------------
    # 3. Validate user and role
    # --------------------------------------------------
    role = get_user_role(username)

    if role is None:
        return {
            "status": "Blocked",
            "reason": "Invalid user"
        }

    # --------------------------------------------------
    # 4. Rule-based prompt injection detection
    # --------------------------------------------------
    is_injection, detected_patterns = detect_prompt_injection(
        request.prompt
    )

    # --------------------------------------------------
    # 5. ML threat detection
    # --------------------------------------------------
    ml_threat_detected, ml_confidence, ml_label = detect_ml_threat(
        request.prompt
    )

    # --------------------------------------------------
    # 6. Risk calculation
    # --------------------------------------------------
    risk_score, risk_level = calculate_risk(
        request.prompt,
        role
    )

    # --------------------------------------------------
    # 7. Prompt length validation
    # --------------------------------------------------
    max_length = get_max_prompt_length(username)

    is_valid, message = check_prompt_length(
        request.prompt,
        max_length
    )

    if not is_valid:

        log_request(
            username=username,
            role=role,
            prompt=request.prompt,
            status="Blocked",
            prompt_injection_detected=int(is_injection),
            detected_patterns=", ".join(detected_patterns),
            risk_score=risk_score,
            risk_level=risk_level,
            ml_threat_detected=int(ml_threat_detected),
            ml_confidence=ml_confidence
        )

        return {
            "status": "Blocked",
            "reason": message,
            "risk_score": risk_score,
            "risk_level": risk_level
        }

    # --------------------------------------------------
    # 8. Firewall rules
    # --------------------------------------------------
    is_safe, message = check_prompt(
        request.prompt,
        role
    )

    if not is_safe:

        log_blocked_prompt(
            request.prompt,
            message
        )

        log_request(
            username=username,
            role=role,
            prompt=request.prompt,
            status="Blocked",
            prompt_injection_detected=int(is_injection),
            detected_patterns=", ".join(detected_patterns),
            risk_score=risk_score,
            risk_level=risk_level,
            ml_threat_detected=int(ml_threat_detected),
            ml_confidence=ml_confidence
        )

        return {
            "status": "Blocked",
            "reason": message,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "prompt_injection_detected": is_injection,
            "detected_patterns": detected_patterns,
            "ml_threat_detected": ml_threat_detected,
            "ml_confidence": ml_confidence,
            "ml_label": ml_label
        }

    # --------------------------------------------------
    # 9. DLP sanitization
    # --------------------------------------------------
    sanitized_prompt, detected_dlp, dlp_replacements = (
        sanitize_prompt(request.prompt)
    )

    # --------------------------------------------------
    # 10. Forward sanitized prompt to LLM
    # --------------------------------------------------
    response = forward_prompt(
        sanitized_prompt
    )

    # --------------------------------------------------
    # 11. Handle LLM failure
    # --------------------------------------------------
    if not response.get("success", False):

        log_request(
            username=username,
            role=role,
            prompt=request.prompt,
            status="Error",
            prompt_injection_detected=int(is_injection),
            detected_patterns=", ".join(detected_patterns),
            risk_score=risk_score,
            risk_level=risk_level,
            ml_threat_detected=int(ml_threat_detected),
            ml_confidence=ml_confidence
        )

        return {
            "status": "Error",
            "reason": response.get(
                "error",
                "LLM service unavailable"
            )
        }

    # --------------------------------------------------
    # 12. Validate LLM output
    # --------------------------------------------------
    validated_response, output_issues = validate_output(
        response["response"]
    )

    # --------------------------------------------------
    # 13. Restore original sensitive information
    # --------------------------------------------------
    restored_response = restore_sensitive_data(
        validated_response,
        dlp_replacements
    )

    response["response"] = restored_response

    # --------------------------------------------------
    # 14. Log successful request
    # --------------------------------------------------
    log_request(
        username=username,
        role=role,
        prompt=request.prompt,
        status="Success",
        prompt_injection_detected=int(is_injection),
        detected_patterns=", ".join(detected_patterns),
        risk_score=risk_score,
        risk_level=risk_level,
        ml_threat_detected=int(ml_threat_detected),
        ml_confidence=ml_confidence
    )

    # --------------------------------------------------
    # 15. Return protected response
    # --------------------------------------------------
    return {
        "status": "Success",
        "user": username,
        "role": role,

        "risk_score": risk_score,
        "risk_level": risk_level,

        "prompt_injection_detected": is_injection,
        "detected_patterns": detected_patterns,

        "ml_detection": {
            "threat_detected": ml_threat_detected,
            "confidence": ml_confidence,
            "label": ml_label
        },

        "dlp": {
            "detected": detected_dlp,
            "sanitized": bool(dlp_replacements),
            "restored": bool(dlp_replacements),
            "entities": detected_dlp
        },

        "sanitized_prompt": sanitized_prompt,

        "output_validation": {
            "issues_detected": output_issues,
            "validated": len(output_issues) == 0
        },

        "llm_response": response
    }


@router.get("/dashboard/stats")
def dashboard_stats(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    username = verify_token(token)

    require_role(
        username,
        ["Admin"]
    )

    from app.database import get_connection

    conn = get_connection()
    cursor = conn.cursor()

    # Total requests
    cursor.execute(
        "SELECT COUNT(*) FROM request_logs"
    )
    total_requests = cursor.fetchone()[0]

    # Successful requests
    cursor.execute(
        "SELECT COUNT(*) FROM request_logs WHERE status='Success'"
    )
    success_requests = cursor.fetchone()[0]

    # Blocked requests
    cursor.execute(
        "SELECT COUNT(*) FROM request_logs WHERE status='Blocked'"
    )
    blocked_requests = cursor.fetchone()[0]

    # Blocked prompts
    cursor.execute(
        "SELECT COUNT(*) FROM blocked_logs"
    )
    blocked_prompts = cursor.fetchone()[0]

    # Attack attempts
    cursor.execute("""
        SELECT COUNT(*)
        FROM request_logs
        WHERE status='Blocked'
    """)
    attack_attempts = cursor.fetchone()[0]

    conn.close()

    return {
        "total_requests": total_requests,
        "success_requests": success_requests,
        "blocked_requests": blocked_requests,
        "blocked_prompts": blocked_prompts,
        "system_health": "Online",
        "attack_attempts": attack_attempts
    }


@router.get("/dashboard/activity")
def dashboard_activity(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    username = verify_token(token)

    require_role(
        username,
        ["Admin", "Analyst"]
    )

    from app.database import get_connection

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            username,
            role,
            prompt,
            status,
            timestamp
        FROM request_logs
        ORDER BY id DESC
        LIMIT 10
    """)

    rows = cursor.fetchall()
    conn.close()

    activity = []

    for row in rows:
        activity.append({
            "username": row[0],
            "role": row[1],
            "prompt": row[2],
            "status": row[3],
            "timestamp": row[4]
        })

    return {
        "activity": activity
    }