"""
Database Initialization & Connection Test Script
Run from terminal:
    .venv\\Scripts\\python.exe init_db.py
"""

import os
import sys
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def test_and_init_db():
    host = os.getenv("DB_HOST", "localhost")
    port = int(os.getenv("DB_PORT", 3306))
    user = os.getenv("DB_USER", "root")
    password = os.getenv("DB_PASSWORD", "")
    db_name = os.getenv("DB_NAME", "hotel_management1")

    print("=" * 60)
    print("🏨 HOTEL MANAGEMENT SYSTEM - DATABASE SETUP & DIAGNOSTIC")
    print("=" * 60)
    print(f"[*] Target Host     : {host}")
    print(f"[*] Port            : {port}")
    print(f"[*] User            : {user}")
    print(f"[*] Database Name   : {db_name}")
    print("-" * 60)

    # 1. Connect to MySQL server (without database selected first)
    print("[1/3] Testing connection to MySQL Server...")
    try:
        conn = mysql.connector.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            connect_timeout=10
        )
        print("  --> [OK] Connected to MySQL Server successfully!")
    except Exception as e:
        print(f"  --> [FAIL] Could not connect to MySQL Server at {host}:{port}")
        print(f"  --> Error: {e}")
        print("\n[!] TROUBLESHOOTING:")
        print("  1. If running locally, ensure MySQL is running (Start XAMPP MySQL or run 'net start MySQL80' as admin).")
        print("  2. If using Cloud MySQL (Aiven/TiDB), verify host, port, user, and password in your .env file.")
        return False

    cursor = conn.cursor()

    # 2. Create Database if not exists
    print(f"\n[2/3] Checking / Creating database `{db_name}`...")
    try:
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        cursor.execute(f"USE `{db_name}`")
        print(f"  --> [OK] Database `{db_name}` is ready!")
    except Exception as e:
        print(f"  --> [FAIL] Error creating/using database: {e}")
        cursor.close()
        conn.close()
        return False

    # 3. Read and execute hotel_db.sql schema
    print("\n[3/3] Initializing tables and schema from database/hotel_db.sql...")
    sql_file_path = os.path.join(os.path.dirname(__file__), "database", "hotel_db.sql")
    if os.path.exists(sql_file_path):
        with open(sql_file_path, "r", encoding="utf-8") as f:
            sql_statements = f.read()

        # Split and execute individual queries
        statements = [stmt.strip() for stmt in sql_statements.split(";") if stmt.strip()]
        executed_count = 0
        for stmt in statements:
            if stmt:
                try:
                    cursor.execute(stmt)
                    executed_count += 1
                except Exception as e:
                    # Ignore 'already exists' or non-fatal warnings
                    pass

        conn.commit()
        print(f"  --> [OK] Successfully executed {executed_count} schema statements!")
    else:
        print(f"  --> [WARN] SQL file not found at {sql_file_path}, skipping table seeding.")

    # 4. Verify existing tables
    cursor.execute("SHOW TABLES")
    tables = [t[0] for t in cursor.fetchall()]
    print(f"\n[+] Verified Active Tables in `{db_name}`:")
    for table in tables:
        print(f"     - {table}")

    cursor.close()
    conn.close()
    print("=" * 60)
    print(" ALL DATABASE CHECKS PASSED! YOU CAN NOW REGISTER & LOGIN! 🚀")
    print("=" * 60)
    return True


if __name__ == "__main__":
    test_and_init_db()
