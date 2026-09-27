from flask import request, jsonify, Blueprint
from flask.views import MethodView
from utils.connection import get_db_connection
import bcrypt
import jwt
import datetime

login_apis_blueprint = Blueprint(
    "login_apis_blueprint",
    __name__
)


class LoginAPI(MethodView):

    SECRET_KEY = "HOTEL_SECRET_KEY"

    def post(self):

        conn = None
        cursor = None

        try:

            data = request.get_json()

            username = data.get("username")
            password = data.get("password")

            # ==========================
            # VALIDATION
            # ==========================

            if not username:
                return jsonify({
                    "success": False,
                    "message": "Username is required"
                }), 400

            if not password:
                return jsonify({
                    "success": False,
                    "message": "Password is required"
                }), 400

            # ==========================
            # DATABASE CONNECTION
            # ==========================

            conn = get_db_connection()

            if conn is None:
                return jsonify({
                    "success": False,
                    "message": "Database connection failed"
                }), 500

            cursor = conn.cursor(dictionary=True)

            # ==========================
            # CHECK USER
            # ==========================

            cursor.execute(
                """
                SELECT *
                FROM register
                WHERE username = %s
                """,
                (username,)
            )

            user = cursor.fetchone()

            if not user:
                return jsonify({
                    "success": False,
                    "message": "Invalid Username"
                }), 401

            # ==========================
            # VERIFY PASSWORD
            # ==========================

            is_valid_password = bcrypt.checkpw(
                password.encode("utf-8"),
                user["password_hash"].encode("utf-8")
            )

            if not is_valid_password:
                return jsonify({
                    "success": False,
                    "message": "Invalid Password"
                }), 401

            # ==========================
            # ACCESS TOKEN
            # ==========================

            access_token = jwt.encode(
                {
                    "register_id": user["register_id"],
                    "username": user["username"],
                    "role": user["role"],
                    "exp": datetime.datetime.utcnow()
                    + datetime.timedelta(hours=8)
                },
                self.SECRET_KEY,
                algorithm="HS256"
            )

            # ==========================
            # REFRESH TOKEN
            # ==========================

            refresh_token = jwt.encode(
                {
                    "register_id": user["register_id"],
                    "type": "refresh",
                    "exp": datetime.datetime.utcnow()
                    + datetime.timedelta(days=7)
                },
                self.SECRET_KEY,
                algorithm="HS256"
            )

            # ==========================
            # SESSION INFO
            # ==========================

            ip_address = request.remote_addr

            device_info = request.headers.get(
                "User-Agent"
            )

            # SAVE SESSION

            cursor.execute(
                """
                INSERT INTO user_sessions
                (
                    register_id,
                    ip_address,
                    device_info,
                    access_token,
                    refresh_token,
                    session_status
                )
                VALUES
                (
                    %s,%s,%s,%s,%s,%s
                )
                """,
                (
                    user["register_id"],
                    ip_address,
                    device_info,
                    access_token,
                    refresh_token,
                    "ACTIVE"
                )
            )

            conn.commit()

            # SUCCESS RESPONSE

            return jsonify({
                "success": True,
                "message": "Login Successful",
                "data": {
                    "register_id": user["register_id"],
                    "username": user["username"],
                    "email": user["email"],
                    "role": user["role"]
                },
                "access_token": access_token,
                "refresh_token": refresh_token
            }), 200

        except Exception as e:

            return jsonify({
                "success": False,
                "message": str(e)
            }), 500

        finally:

            if cursor:
                cursor.close()

            if conn:
                conn.close()


# ROUTES

login_view = LoginAPI.as_view("login_api")

login_apis_blueprint.add_url_rule(
    "/",
    view_func=login_view,
    methods=["POST"]
)