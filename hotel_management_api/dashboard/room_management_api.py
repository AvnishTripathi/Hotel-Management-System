from flask import request, jsonify
from flask.views import MethodView
from flask import Blueprint
from utils.connection import get_connection
room_apis_blueprint = Blueprint("room_apis_blueprint",__name__)

class RoomManagementAPI(MethodView):

 
    # GET ROOM(S)
   

    def get(self, room_id=None):

        conn = None
        cursor = None

        try:
            

            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            # Single Room Details

            if room_id:

                cursor.execute("""
                    SELECT *
                    FROM rooms
                    WHERE room_id = %s
                """, (room_id,))

                room = cursor.fetchone()

                if not room:
                    return jsonify({
                        "success": False,
                        "message": "Room not found"
                    }), 404

                return jsonify({
                    "success": True,
                    "data": room
                })

            # All Rooms

            cursor.execute("""
                SELECT *
                FROM rooms
                ORDER BY room_id DESC
            """)

            rooms = cursor.fetchall()

            return jsonify({
                "success": True,
                "count": len(rooms),
                "data": rooms
            })

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

    # ADD ROOM

    def post(self):

        conn = None
        cursor = None

        try:

            data = request.get_json()

            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute("""
                INSERT INTO rooms(

                    room_number,
                    room_name,
                    room_type,
                    room_status,
                    room_price,
                    max_guests,
                    floor_number,
                    description

                )
                VALUES(
                    %s,%s,%s,%s,%s,%s,%s,%s
                )
            """, (

                data["room_number"],
                data["room_name"],
                data["room_type"],
                data.get("room_status", "AVAILABLE"),
                data["room_price"],
                data["max_guests"],
                data["floor_number"],
                data.get("description")

            ))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Room added successfully"
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

    # UPDATE ROOM / ROOM STATUS

    def put(self, room_id):

        conn = None
        cursor = None

        try:

            data = request.get_json()

            conn = get_connection()
            cursor = conn.cursor()

            # Update Only Room Status

            if "room_status" in data and len(data) == 1:

                cursor.execute("""
                    UPDATE rooms
                    SET room_status=%s
                    WHERE room_id=%s
                """, (
                    data["room_status"],
                    room_id
                ))

                conn.commit()

                return jsonify({
                    "success": True,
                    "message": "Room status updated successfully"
                })

            # Full Room Update

            cursor.execute("""
                UPDATE rooms
                SET

                    room_number=%s,
                    room_name=%s,
                    room_type=%s,
                    room_status=%s,
                    room_price=%s,
                    max_guests=%s,
                    floor_number=%s,
                    description=%s

                WHERE room_id=%s
            """, (

                data["room_number"],
                data["room_name"],
                data["room_type"],
                data["room_status"],
                data["room_price"],
                data["max_guests"],
                data["floor_number"],
                data.get("description"),
                room_id

            ))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Room updated successfully"
            })

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

    # DELETE ROOM

    def delete(self, room_id):

        conn = None
        cursor = None

        try:

            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute("""
                DELETE FROM rooms
                WHERE room_id=%s
            """, (room_id,))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Room deleted successfully"
            })

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