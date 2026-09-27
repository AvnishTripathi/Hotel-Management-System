from flask import request, jsonify, Blueprint
from flask.views import MethodView
from utils.connection import get_db_connection
import bcrypt

user_apis_blueprint = Blueprint(
    "user_apis_blueprint",
    __name__
)

@user_apis_blueprint.route("/<int:user_id>", methods=["GET"])

class UserAPI(MethodView):

    # GET USER(S)

    def get(self, user_id=None):

        conn = None
        cursor = None

        try:

            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            if user_id:

                cursor.execute(
                    """
                    SELECT
                        user_id,
                        first_name,
                        last_name,
                        username,
                        email,
                        phone,
                        role,
                        status,
                        created_at
                    FROM users
                    WHERE user_id=%s
                    """,
                    (user_id,)
                )

                user = cursor.fetchone()

                if not user:

                    return jsonify({
                        "success": False,
                        "message": "User not found"
                    }), 404

                return jsonify({
                    "success": True,
                    "data": user
                }), 200

            cursor.execute(
                """
                SELECT
                    user_id,
                    first_name,
                    last_name,
                    username,
                    email,
                    phone,
                    role,
                    status,
                    created_at
                FROM users
                ORDER BY user_id DESC
                """
            )

            users = cursor.fetchall()

            return jsonify({
                "success": True,
                "count": len(users),
                "data": users
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

    # CREATE USER

    def post(self):

        conn = None
        cursor = None

        try:

            data = request.get_json()

            password_hash = bcrypt.hashpw(
                data["password"].encode("utf-8"),
                bcrypt.gensalt()
            ).decode("utf-8")

            conn = get_db_connection()
            cursor = conn.cursor()

            cursor.execute(
                """
                INSERT INTO users
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
                    data["first_name"],
                    data.get("last_name"),
                    data["username"],
                    data["email"],
                    data.get("phone"),
                    password_hash,
                    data.get("role", "RECEPTIONIST")
                )
            )

            conn.commit()

            return jsonify({
                "success": True,
                "message": "User created successfully",
                "user_id": cursor.lastrowid
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

    # UPDATE USER

    def put(self, user_id):

        conn = None
        cursor = None

        try:

            data = request.get_json()

            conn = get_db_connection()
            cursor = conn.cursor()

            cursor.execute(
                """
                UPDATE users
                SET
                    first_name=%s,
                    last_name=%s,
                    email=%s,
                    phone=%s,
                    role=%s,
                    status=%s
                WHERE user_id=%s
                """,
                (
                    data.get("first_name"),
                    data.get("last_name"),
                    data.get("email"),
                    data.get("phone"),
                    data.get("role"),
                    data.get("status", "ACTIVE"),
                    user_id
                )
            )

            conn.commit()

            return jsonify({
                "success": True,
                "message": "User updated successfully"
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

    # ==========================================
    # DELETE USER (SOFT DELETE)
    # ==========================================

    def delete(self, user_id):

        conn = None
        cursor = None

        try:

            conn = get_db_connection()
            cursor = conn.cursor()

            cursor.execute(
                """
                UPDATE users
                SET status='INACTIVE'
                WHERE user_id=%s
                """,
                (user_id,)
            )

            conn.commit()

            return jsonify({
                "success": True,
                "message": "User deleted successfully"
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

