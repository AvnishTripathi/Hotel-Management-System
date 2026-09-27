from flask import request, jsonify
from flask.views import MethodView
from flask import Blueprint
from utils.connection import get_connection

notification_apis_blueprint = Blueprint(
    "notification_apis_blueprint",
    __name__
)


class NotificationAPI(MethodView):

    # GET NOTIFICATION(S)

    def get(self, notification_id=None):

        conn = None
        cursor = None

        try:

            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            if notification_id:

                cursor.execute("""
                    SELECT *
                    FROM notifications
                    WHERE notification_id=%s
                """, (notification_id,))

                notification = cursor.fetchone()

                if not notification:
                    return jsonify({
                        "success": False,
                        "message": "Notification not found"
                    }), 404

                return jsonify({
                    "success": True,
                    "data": notification
                }), 200

            cursor.execute("""
                SELECT *
                FROM notifications
                ORDER BY notification_id DESC
            """)

            notifications = cursor.fetchall()

            return jsonify({
                "success": True,
                "count": len(notifications),
                "data": notifications
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

    # CREATE NOTIFICATION

    def post(self):

        conn = None
        cursor = None

        try:

            data = request.get_json()

            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute("""
                INSERT INTO notifications(
                    guest_id,
                    booking_id,
                    notification_type,
                    recipient_name,
                    recipient_email,
                    recipient_phone,
                    subject,
                    message,
                    status,
                    sent_at
                )
                VALUES(
                    %s,%s,%s,%s,%s,%s,%s,%s,%s,NOW()
                )
            """, (

                data.get("guest_id"),
                data.get("booking_id"),
                data["notification_type"],
                data.get("recipient_name"),
                data.get("recipient_email"),
                data.get("recipient_phone"),
                data["subject"],
                data["message"],
                "SENT"

            ))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Notification created successfully",
                "notification_id": cursor.lastrowid
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

    # UPDATE NOTIFICATION STATUS

    def put(self, notification_id):

        conn = None
        cursor = None

        try:

            data = request.get_json()

            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute("""
                UPDATE notifications
                SET
                    status=%s,
                    error_message=%s
                WHERE notification_id=%s
            """, (

                data["status"],
                data.get("error_message"),
                notification_id

            ))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Notification updated successfully"
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

    # DELETE NOTIFICATION

    def delete(self, notification_id):

        conn = None
        cursor = None

        try:

            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute("""
                DELETE FROM notifications
                WHERE notification_id=%s
            """, (notification_id,))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Notification deleted successfully"
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


