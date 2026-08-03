import sqlite3

DATABASE = "llm_guard.db"


def get_connection():
    return sqlite3.connect(DATABASE)