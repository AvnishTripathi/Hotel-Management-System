import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()


def get_db_connection():
    try:
        port_env = os.getenv("DB_PORT", "3306")
        try:
            port = int(port_env)
        except ValueError:
            port = 3306

        conn_params = {
            "host": os.getenv("DB_HOST", "localhost"),
            "port": port,
            "user": os.getenv("DB_USER", "root"),
            "password": os.getenv("DB_PASSWORD", ""),
            "database": os.getenv("DB_NAME", "hotel_management1"),
            "connect_timeout": 10
        }

        # Optional SSL support for cloud databases (TiDB, Aiven, PlanetScale)
        ssl_disabled = os.getenv("DB_SSL_DISABLED", "false").lower() in ("true", "1")
        ssl_ca = os.getenv("DB_SSL_CA", None)
        if ssl_ca and os.path.exists(ssl_ca):
            conn_params["ssl_ca"] = ssl_ca
        elif not ssl_disabled and os.getenv("DB_HOST", "localhost") not in ("localhost", "127.0.0.1"):
            # Enable SSL by default for remote cloud hosts if available
            conn_params["ssl_disabled"] = False

        conn = mysql.connector.connect(**conn_params)
        return conn

    except mysql.connector.Error as e:
        print("[!] Database connection failed:", str(e))
        return None



def get_connection():
    return get_db_connection()