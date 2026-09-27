from flask import request, jsonify
from flask.views import MethodView
from utils.connection import get_connection
from flask import Blueprint
import uuid

booking_apis_blueprint = Blueprint("booking_apis_blueprint",__name__)
class ReservationBookingAPI(MethodView):

    # GET BOOKINGS / BOOKING DETAILS / BOOKING HISTORY

    def get(self, booking_id=None):

        try:

            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            # Check Availability API
            if request.args.get("action") == "availability":

                room_id = request.args.get("room_id")
                check_in = request.args.get("check_in")
                check_out = request.args.get("check_out")

                cursor.execute("""
                    SELECT booking_id
                    FROM bookings
                    WHERE room_id=%s
                    AND booking_status IN
                    ('CONFIRMED','CHECKED_IN')
                    AND (
                        (%s BETWEEN check_in_date AND check_out_date)
                        OR
                        (%s BETWEEN check_in_date AND check_out_date)
                    )
                """, (
                    room_id,
                    check_in,
                    check_out
                ))

                booking = cursor.fetchone()

                return jsonify({
                    "success": True,
                    "available": False if booking else True
                })

            # Booking Details

            if booking_id:

                cursor.execute("""
                    SELECT
                        b.*,
                        r.room_number,
                        r.room_type
                    FROM bookings b
                    LEFT JOIN rooms r
                    ON b.room_id = r.room_id
                    WHERE b.booking_id=%s
                """, (booking_id,))

                booking = cursor.fetchone()

                if not booking:
                    return jsonify({
                        "success": False,
                        "message": "Booking not found"
                    }), 404

                return jsonify({
                    "success": True,
                    "data": booking
                })

            # Booking History

            cursor.execute("""
                SELECT *
                FROM bookings
                ORDER BY booking_id DESC
            """)

            bookings = cursor.fetchall()

            return jsonify({
                "success": True,
                "count": len(bookings),
                "data": bookings
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

    # NEW BOOKING

    def post(self):

        try:

            data = request.get_json()

            room_id = data["room_id"]

            check_in_date = data["check_in_date"]
            check_out_date = data["check_out_date"]

            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            # Check Room Availability

            cursor.execute("""
                SELECT booking_id
                FROM bookings
                WHERE room_id=%s
                AND booking_status IN
                ('CONFIRMED','CHECKED_IN')
                AND (
                    (%s BETWEEN check_in_date AND check_out_date)
                    OR
                    (%s BETWEEN check_in_date AND check_out_date)
                )
            """, (
                room_id,
                check_in_date,
                check_out_date
            ))

            existing_booking = cursor.fetchone()

            if existing_booking:

                return jsonify({
                    "success": False,
                    "message": "Room not available"
                }), 400

            booking_reference = (
                "BK-" +
                str(uuid.uuid4()).split("-")[0].upper()
            )

            cursor.execute(
    """
    INSERT INTO bookings(

        booking_reference,
        room_id,
        guest_name,
        guest_email,
        guest_phone,
        check_in_date,
        check_out_date,
        total_guests,
        total_amount,
        booking_status,
        special_request

    )
    VALUES(

        %s,%s,%s,%s,%s,
        %s,%s,%s,%s,%s,%s

    )
    """,
    (

        booking_reference,
        room_id,
        data["guest_name"],
        data["guest_email"],
        data["guest_phone"],
        check_in_date,
        check_out_date,
        data["total_guests"],
        data["total_amount"],
        "CONFIRMED",
        data.get("special_request")

    )
)
            conn.commit()

            return jsonify({
                "success": True,
                "message": "Booking created successfully",
                "booking_reference": booking_reference
            }), 201

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

    # MODIFY BOOKING

    def put(self, booking_id):

        try:

            data = request.get_json()

            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute("""
                UPDATE bookings
                SET
                    check_in_date=%s,
                    check_out_date=%s,
                    total_guests=%s,
                    total_amount=%s,
                    special_request=%s
                WHERE booking_id=%s
            """, (

                data["check_in_date"],
                data["check_out_date"],
                data["total_guests"],
                data["total_amount"],
                data.get("special_request"),
                booking_id

            ))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Booking updated successfully"
            })

        except Exception as e:

            return jsonify({
                "success": False,
                "message": str(e)
            }), 500

    # CANCEL BOOKING

    def delete(self, booking_id):

        try:

            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute("""
                UPDATE bookings
                SET booking_status='CANCELLED'
                WHERE booking_id=%s
            """, (booking_id,))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Booking cancelled successfully"
            })

        except Exception as e:

            return jsonify({
                "success": False,
                "message": str(e)
            }), 500