from flask import request, jsonify
from flask.views import MethodView
from flask import Blueprint
from utils.connection import get_connection

housekeeping_apis_blueprint = Blueprint(
    "housekeeping_apis_blueprint",
    __name__
)


class HousekeepingManagementAPI(MethodView):

    # GET TASK(S)

    def get(self, housekeeping_id=None):

        conn = None
        cursor = None

        try:

            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            if housekeeping_id:

                cursor.execute("""
                    SELECT *
                    FROM housekeeping
                    WHERE housekeeping_id=%s
                """, (housekeeping_id,))

                task = cursor.fetchone()

                if not task:
                    return jsonify({
                        "success": False,
                        "message": "Task not found"
                    }), 404

                return jsonify({
                    "success": True,
                    "data": task
                }), 200

            cursor.execute("""
                SELECT *
                FROM housekeeping
                ORDER BY housekeeping_id DESC
            """)

            tasks = cursor.fetchall()

            return jsonify({
                "success": True,
                "count": len(tasks),
                "data": tasks
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

    # CREATE TASK

    def post(self):

        conn = None
        cursor = None

        try:

            data = request.get_json()

            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            # Check Room Exists

            cursor.execute("""
                SELECT room_id
                FROM rooms
                WHERE room_id=%s
            """, (data["room_id"],))

            room = cursor.fetchone()

            if not room:
                return jsonify({
                    "success": False,
                    "message": "Room not found"
                }), 404

            cursor = conn.cursor()

            cursor.execute("""
                INSERT INTO housekeeping(

                    room_id,
                    assigned_to,
                    task_type,
                    task_description,
                    cleaning_status,
                    lost_item_name,
                    lost_item_location,
                    maintenance_issue,
                    priority_level,
                    remarks

                )
                VALUES(
                    %s,%s,%s,%s,%s,%s,%s,%s,%s,%s
                )
            """, (

                data["room_id"],
                data["assigned_to"],
                data["task_type"],
                data.get("task_description"),
                data.get("cleaning_status", "PENDING"),
                data.get("lost_item_name"),
                data.get("lost_item_location"),
                data.get("maintenance_issue"),
                data.get("priority_level", "LOW"),
                data.get("remarks")

            ))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Task created successfully",
                "housekeeping_id": cursor.lastrowid
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

    # UPDATE TASK

    def put(self, housekeeping_id):

        conn = None
        cursor = None

        try:

            data = request.get_json()

            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute("""
                UPDATE housekeeping
                SET
                    assigned_to=%s,
                    cleaning_status=%s,
                    priority_level=%s,
                    remarks=%s,

                    completed_date=
                    CASE
                        WHEN %s='COMPLETED'
                        THEN NOW()
                        ELSE completed_date
                    END

                WHERE housekeeping_id=%s
            """, (

                data["assigned_to"],
                data["cleaning_status"],
                data["priority_level"],
                data.get("remarks"),
                data["cleaning_status"],
                housekeeping_id

            ))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Task updated successfully"
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

    # DELETE TASK

    def delete(self, housekeeping_id):

        conn = None
        cursor = None

        try:

            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute("""
                DELETE FROM housekeeping
                WHERE housekeeping_id=%s
            """, (housekeeping_id,))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Task deleted successfully"
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


