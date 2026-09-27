import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()


def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "hotel_management1")
        )
        return conn

    except mysql.connector.Error as e:
        print("[!] Database connection failed:", str(e))
        return None



def get_connection():
    return get_db_connection()