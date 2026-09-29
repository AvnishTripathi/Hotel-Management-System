from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

# CREATE APP

app = Flask(__name__)

# ENABLE CORS

CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True
)

# IMPORT BLUEPRINTS

from hotel_management_api.view import (
    register_apis_blueprint,
    login_apis_blueprint,
    logout_apis_blueprint,
    user_apis_blueprint,
    room_apis_blueprint,
    booking_apis_blueprint,
    guest_apis_blueprint,
    guest_auth_blueprint,
    checkin_checkout_apis_blueprint,
    payment_apis_blueprint,
    housekeeping_apis_blueprint,
    report_apis_blueprint,
    setting_apis_blueprint,
    notification_apis_blueprint
)

# AUTHENTICATION

app.register_blueprint(register_apis_blueprint,url_prefix="/register")
app.register_blueprint(login_apis_blueprint,url_prefix="/login")
app.register_blueprint(logout_apis_blueprint,url_prefix="/logout")

# USER MANAGEMENT
app.register_blueprint(user_apis_blueprint,url_prefix="/users")

# ROOM MANAGEMENT
app.register_blueprint(room_apis_blueprint,url_prefix="/rooms")

# BOOKING MANAGEMENT
app.register_blueprint(booking_apis_blueprint,url_prefix="/bookings")

# GUEST MANAGEMENT
app.register_blueprint(guest_apis_blueprint,url_prefix="/guests")


# GUEST AUTHENTICATION
app.register_blueprint(guest_auth_blueprint,url_prefix="/api/guest")

# CHECK-IN / CHECK-OUT
app.register_blueprint(checkin_checkout_apis_blueprint,url_prefix="/stays")

# PAYMENT MANAGEMENT
app.register_blueprint(payment_apis_blueprint,url_prefix="/payments")

# HOUSEKEEPING MANAGEMENT
app.register_blueprint(housekeeping_apis_blueprint,url_prefix="/housekeeping")

# REPORT MANAGEMENT
app.register_blueprint(report_apis_blueprint,url_prefix="/reports")

# SETTINGS MANAGEMENT
app.register_blueprint(setting_apis_blueprint,url_prefix="/settings")

# NOTIFICATION MANAGEMENT
app.register_blueprint(notification_apis_blueprint,url_prefix="/notifications")

# HOME ROUTE


@app.route("/")
def home():
    return {
        "success": True,
        "message": "Hotel Management API Running Successfully 🚀"
    }


@app.route("/health")
def health():
    from utils.connection import get_connection
    conn = get_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            cursor.fetchall()
            cursor.close()
            conn.close()
            return {
                "status": "healthy",
                "database": "connected",
                "message": "Database connection is active and verified ✅"
            }, 200
        except Exception as e:
            return {
                "status": "degraded",
                "database": "error",
                "error": str(e)
            }, 500
    else:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "message": "Could not connect to database. Check DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME environment variables."
        }, 500


# RUN SERVER


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )