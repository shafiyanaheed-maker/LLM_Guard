from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import FileResponse, RedirectResponse
from app.auth import get_user_role, get_max_prompt_length
from app.models import PromptRequest
from app.firewall import check_prompt, check_prompt_length
from app.proxy import forward_prompt
from app.logger import log_blocked_prompt, log_request
from app.risk import calculate_risk
from app.injection_detector import detect_prompt_injection
from app.rate_limiter import check_rate_limit
from app.dlp import sanitize_prompt
from app.security import verify_token
# Added import for output validation
from app.output_validator import validate_output

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
def get_logs():

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

    return {"logs": logs}


@router.post("/prompt")
def receive_prompt(
    request: PromptRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    # Verify JWT Token
    token = credentials.credentials
    username = verify_token(token)

    # Rate Limiting
    if not check_rate_limit(username):
        return {
            "status": "Blocked",
            "reason": "Rate limit exceeded. Try again later."
        }

    # User Validation
    role = get_user_role(username)

    if role is None:
        return {
            "status": "Blocked",
            "reason": "Invalid user"
        }

    # AI Threat Detection (Calculated early for access by all logs)
    is_injection, detected_patterns = detect_prompt_injection(
        request.prompt
    )

    # Risk Score (Calculated early for access by all logs)
    risk_score, risk_level = calculate_risk(
        request.prompt,
        role
    )

    # Prompt Length Check
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
            risk_level=risk_level
        )

        return {
            "status": "Blocked",
            "reason": message
        }

    # Firewall Check
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
            risk_level=risk_level
        )

        # Updated block response to include risk metrics
        return {
            "status": "Blocked",
            "reason": message,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "prompt_injection_detected": is_injection,
            "detected_patterns": detected_patterns
        }

    # -----------------------------
    # DLP Engine
    # -----------------------------
    sanitized_prompt, detected_dlp = sanitize_prompt(
        request.prompt
    )

    # Forward Sanitized Prompt
    response = forward_prompt(sanitized_prompt)

    # Validate LLM Output
    validated_response, output_issues = validate_output(
        response["response"]
    )

    # Update response with validated output
    response["response"] = validated_response

    # Log Request
    log_request(
        username=username,
        role=role,
        prompt=request.prompt,
        status="Success",
        prompt_injection_detected=int(is_injection),
        detected_patterns=", ".join(detected_patterns),
        risk_score=risk_score,
        risk_level=risk_level
    )

    return {
        "status": "Success",
        "user": username,
        "role": role,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "prompt_injection_detected": is_injection,
        "detected_patterns": detected_patterns,
        "dlp_detected": detected_dlp,
        "sanitized_prompt": sanitized_prompt,
        "output_validation": {
            "issues_detected": output_issues,
            "validated": len(output_issues) == 0
        },
        "llm_response": response
    }

@router.get("/dashboard/stats")
def dashboard_stats():

    from app.database import get_connection

    conn = get_connection()
    cursor = conn.cursor()

    # Total Requests
    cursor.execute("SELECT COUNT(*) FROM request_logs")
    total_requests = cursor.fetchone()[0]

    # Successful Requests
    cursor.execute(
        "SELECT COUNT(*) FROM request_logs WHERE status='Success'"
    )
    success_requests = cursor.fetchone()[0]

    # Blocked Requests
    cursor.execute(
        "SELECT COUNT(*) FROM request_logs WHERE status='Blocked'"
    )
    blocked_requests = cursor.fetchone()[0]

    # Total DLP Detections
    cursor.execute("SELECT COUNT(*) FROM blocked_logs")
    blocked_prompts = cursor.fetchone()[0]

    # Attack Attempts
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

# Added endpoint for recent dashboard activity
@router.get("/dashboard/activity")
def dashboard_activity():

    from app.database import get_connection

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            username,
            role,
            status,
            prompt,
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
            "status": row[2],
            "prompt": row[3],
            "timestamp": row[4]
        })

    return {"activity": activity}
