from flask import request, jsonify
from flask.views import MethodView
from flask import Blueprint
from utils.connection import get_connection

from datetime import datetime

checkin_checkout_apis_blueprint = Blueprint("checkin_checkout_apis_blueprint",__name__)
class CheckInCheckOutAPI(MethodView):

   
    # GET STAY DETAILS / HISTORY


    def get(self, stay_id=None):

        try:

            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            if stay_id:

                cursor.execute("""
                    SELECT
                        s.*,
                        g.first_name,
                        g.last_name,
                        r.room_number
                    FROM stays s
                    INNER JOIN guests g
                        ON s.guest_id = g.guest_id
                    INNER JOIN rooms r
                        ON s.room_id = r.room_id
                    WHERE s.stay_id=%s
                """, (stay_id,))

                stay = cursor.fetchone()

                if not stay:
                    return jsonify({
                        "success": False,
                        "message": "Stay not found"
                    }), 404

                return jsonify({
                    "success": True,
                    "data": stay
                })

            cursor.execute("""
                SELECT *
                FROM stays
                ORDER BY stay_id DESC
            """)

            stays = cursor.fetchall()

            return jsonify({
                "success": True,
                "count": len(stays),
                "data": stays
            })

        except Exception as e:

            return jsonify({
                "success": False,
                "message": str(e)
            }), 500

        finally:
            try:
                cursor.close()
                conn.close()
            except:
                pass

   
    # CHECK-IN GUEST
  

    def post(self):

        try:

            data = request.get_json()

            guest_id = data["guest_id"]
            booking_id = data["booking_id"]
            room_id = data["room_id"]

            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            # Check room availability

            cursor.execute("""
                SELECT room_status
                FROM rooms
                WHERE room_id=%s
            """, (room_id,))

            room = cursor.fetchone()

            if not room:
                return jsonify({
                    "success": False,
                    "message": "Room not found"
                }), 404

            if room["room_status"] != "AVAILABLE":

                return jsonify({
                    "success": False,
                    "message": "Room is not available"
                }), 400

            # Create Stay

            cursor.execute("""
                INSERT INTO stays(

                    guest_id,
                    booking_id,
                    room_id,
                    actual_checkin,
                    stay_status

                )
                VALUES(
                    %s,%s,%s,NOW(),'CHECKED_IN'
                )
            """, (
                guest_id,
                booking_id,
                room_id
            ))

            stay_id = cursor.lastrowid

            # Update Room Status

            cursor.execute("""
                UPDATE rooms
                SET room_status='OCCUPIED'
                WHERE room_id=%s
            """, (room_id,))

            # Update Booking Status

            cursor.execute("""
                UPDATE bookings
                SET booking_status='CHECKED_IN'
                WHERE booking_id=%s
            """, (booking_id,))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Guest checked in successfully",
                "stay_id": stay_id
            })

        except Exception as e:

            return jsonify({
                "success": False,
                "message": str(e)
            }), 500

   
    # UPDATE STAY
 

    def put(self, stay_id):

        try:

            data = request.get_json()

            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute("""
                UPDATE stays
                SET
                    remarks=%s
                WHERE stay_id=%s
            """, (
                data.get("remarks"),
                stay_id
            ))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Stay updated successfully"
            })

        except Exception as e:

            return jsonify({
                "success": False,
                "message": str(e)
            }), 500

   
    # CHECK-OUT GUEST
  

    def delete(self, stay_id):

        try:

            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            # Get Stay

            cursor.execute("""
                SELECT *
                FROM stays
                WHERE stay_id=%s
            """, (stay_id,))

            stay = cursor.fetchone()

            if not stay:

                return jsonify({
                    "success": False,
                    "message": "Stay not found"
                }), 404

            # Update Stay

            cursor.execute("""
                UPDATE stays
                SET
                    check_out_time=NOW(),
                    stay_status='CHECKED_OUT'
                WHERE stay_id=%s
            """, (stay_id,))

            # Update Room

            cursor.execute("""
                UPDATE rooms
                SET room_status='AVAILABLE'
                WHERE room_id=%s
            """, (stay["room_id"],))

            # Update Booking

            cursor.execute("""
                UPDATE bookings
                SET booking_status='COMPLETED'
                WHERE booking_id=%s
            """, (stay["booking_id"],))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Guest checked out successfully",
                "invoice_generated": True
            })

        except Exception as e:

            return jsonify({
                "success": False,
                "message": str(e)
            }), 500