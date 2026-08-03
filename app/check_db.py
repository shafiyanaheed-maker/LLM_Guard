import sqlite3

conn = sqlite3.connect("llm_guard.db")
cursor = conn.cursor()

cursor.execute("""
SELECT
    username,
    prompt,
    status,
    prompt_injection_detected,
    detected_patterns,
    risk_score,
    risk_level
FROM request_logs
ORDER BY id DESC
LIMIT 5
""")

rows = cursor.fetchall()

for row in rows:
    print(row)

conn.close()