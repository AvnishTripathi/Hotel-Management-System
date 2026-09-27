from flask import request, jsonify
from flask.views import MethodView
from flask import Blueprint
from utils.connection import get_connection

logout_apis_blueprint = Blueprint("logout_apis_blueprint", __name__)
class LogoutAPI(MethodView):

    def post(self):

        try:

            data = request.get_json()

            user_id = data.get("user_id")
            logout_all = data.get("logout_all", False)

            conn = get_connection()
            cursor = conn.cursor()

            # Logout All Devices

            if logout_all:

                cursor.execute("""
                    UPDATE user_sessions
                    SET
                        session_status='LOGGED_OUT',
                        logout_time=NOW()
                    WHERE user_id=%s
                    AND session_status='ACTIVE'
                """, (user_id,))

                conn.commit()

                return jsonify({
                    "success": True,
                    "message": "Logged out from all devices"
                })

            # Logout Current Session

            access_token = data.get("access_token")

            cursor.execute("""
                UPDATE user_sessions
                SET
                    session_status='LOGGED_OUT',
                    logout_time=NOW()
                WHERE access_token=%s
                AND session_status='ACTIVE'
            """, (access_token,))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Logout successful"
            })

        except Exception as e:

            return jsonify({
                "success": False,
                "message": str(e)
            }), 500

        
        finally:
              if  cursor:
                conn.close()
              if conn:
                conn.close()