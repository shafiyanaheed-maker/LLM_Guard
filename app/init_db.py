from app.database import get_connection


def initialize_database():
    conn = get_connection()
    cursor = conn.cursor()

    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users(
        username TEXT PRIMARY KEY,
        role TEXT NOT NULL,
        max_prompt_length INTEGER NOT NULL
    )
    """)

    # Request Logs (Updated with new security tracking columns)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS request_logs(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        role TEXT,
        prompt TEXT,
        status TEXT,
        
        prompt_injection_detected INTEGER DEFAULT 0,
        detected_patterns TEXT,
        risk_score INTEGER DEFAULT 0,
        risk_level TEXT,
        
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # ML Detection columns
    cursor.execute("PRAGMA table_info(request_logs)")
    columns = [column[1] for column in cursor.fetchall()]

    if "ml_threat_detected" not in columns:
        cursor.execute("""
            ALTER TABLE request_logs
            ADD COLUMN ml_threat_detected INTEGER DEFAULT 0
        """)

    if "ml_confidence" not in columns:
        cursor.execute("""
            ALTER TABLE request_logs
            ADD COLUMN ml_confidence REAL DEFAULT 0
        """)

    # Blocked Logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS blocked_logs(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prompt TEXT,
        reason TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    users = [
        ("admin", "Admin", 2000),
        ("employee", "Employee", 1000),
        ("intern", "Intern", 500)
    ]

    cursor.executemany(
        """
        INSERT OR IGNORE INTO users
        VALUES (?, ?, ?)
        """,
        users
    )

    conn.commit()
    conn.close()

    print("Database initialized successfully!")


if __name__ == "__main__":
    initialize_database()
