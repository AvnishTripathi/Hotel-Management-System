from flask import request, jsonify, Blueprint
from flask.views import MethodView
from utils.connection import get_db_connection
import bcrypt

register_apis_blueprint = Blueprint(
    "register_apis_blueprint",
    __name__
)


class RegisterAPI(MethodView):

    def post(self):

        conn = None
        cursor = None

        try:

            data = request.get_json()

            first_name = data.get("first_name")
            last_name = data.get("last_name")
            username = data.get("username")
            email = data.get("email")
            phone = data.get("phone")
            password = data.get("password")
            role = data.get("role", "RECEPTIONIST")

            # Validation

            if not first_name:
                return jsonify({
                    "success": False,
                    "message": "First Name is required"
                }), 400

            if not last_name:
                return jsonify({
                    "success": False,
                    "message": "Last Name is required"
                }), 400

            if not username:
                return jsonify({
                    "success": False,
                    "message": "Username is required"
                }), 400

            if not email:
                return jsonify({
                    "success": False,
                    "message": "Email is required"
                }), 400

            if not phone:
                return jsonify({
                    "success": False,
                    "message": "Phone Number is required"
                }), 400

            if not password:
                return jsonify({
                    "success": False,
                    "message": "Password is required"
                }), 400

            conn = get_db_connection()

            if conn is None:
                return jsonify({
                    "success": False,
                    "message": "Database connection failed"
                }), 500

            cursor = conn.cursor(dictionary=True)

            # Check Existing User

            cursor.execute(
                """
                SELECT register_id
                FROM register
                WHERE username=%s
                OR email=%s
                """,
                (username, email)
            )

            existing_user = cursor.fetchone()

            if existing_user:

                return jsonify({
                    "success": False,
                    "message": "Username or Email already exists"
                }), 409

            # Hash Password

            password_hash = bcrypt.hashpw(
                password.encode("utf-8"),
                bcrypt.gensalt()
            ).decode("utf-8")

            # Insert User

            cursor.execute(
                """
                INSERT INTO register
                (
                    first_name,
                    last_name,
                    username,
                    email,
                    phone,
                    password_hash,
                    role
                )
                VALUES
                (
                    %s,%s,%s,%s,%s,%s,%s
                )
                """,
                (
                    first_name,
                    last_name,
                    username,
                    email,
                    phone,
                    password_hash,
                    role
                )
            )

            conn.commit()

            register_id = cursor.lastrowid

            return jsonify({
                "success": True,
                "message": "User registered successfully",
                "data": {
                    "register_id": register_id,
                    "first_name": first_name,
                    "last_name": last_name,
                    "username": username,
                    "email": email,
                    "role": role
                }
            }), 201

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
                
register_api = RegisterAPI.as_view("RegisterAPI")
register_apis_blueprint.add_url_rule("/",view_func=register_api,methods=["POST"])
