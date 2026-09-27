from flask import request, jsonify
from flask.views import MethodView
from flask import Blueprint
from utils.connection import get_connection

import uuid

guest_code = "GST-" + str(uuid.uuid4()).split("-")[0].upper()

guest_apis_blueprint = Blueprint("guest_apis_blueprint",__name__)
class GuestManagementAPI(MethodView):

    # GET GUESTS / GUEST DETAILS / GUEST HISTORY

    def get(self, guest_id=None):

        try:

            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            # Guest Details

            if guest_id:

                cursor.execute("""
                    SELECT *
                    FROM guests
                    WHERE guest_id=%s
                """, (guest_id,))

                guest = cursor.fetchone()

                if not guest:
                    return jsonify({
                        "success": False,
                        "message": "Guest not found"
                    }), 404

                # Guest Booking History

                cursor.execute("""
                    SELECT
                        booking_id,
                        booking_reference,
                        check_in_date,
                        check_out_date,
                        booking_status
                    FROM bookings
                    WHERE guest_id=%s
                    ORDER BY booking_id DESC
                """, (guest_id,))

                history = cursor.fetchall()

                return jsonify({
                    "success": True,
                    "guest": guest,
                    "booking_history": history
                })

            # All Guests

            cursor.execute("""
                SELECT *
                FROM guests
                ORDER BY guest_id DESC
            """)

            guests = cursor.fetchall()

            return jsonify({
                "success": True,
                "count": len(guests),
                "data": guests
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

    # ADD GUEST

    def post(self):

        try:
            guest_code = "GST-" + str(uuid.uuid4()).split("-")[0].upper()
            data = request.get_json()

            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute("""
    INSERT INTO guests(
        guest_code,
        first_name,
        last_name,
        gender,
        date_of_birth,
        email,
        phone,
        address,
        city,
        state,
        country,
        postal_code,
        id_type,
        id_number,
        nationality
    )
    VALUES(
        %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s
    )
""", (
    guest_code,
    data["first_name"],
    data.get("last_name"),
    data.get("gender"),
    data.get("date_of_birth"),
    data.get("email"),
    data["phone"],
    data.get("address"),
    data.get("city"),
    data.get("state"),
    data.get("country"),
    data.get("postal_code"),
    data.get("id_type"),
    data.get("id_number"),
    data.get("nationality")
))
            conn.commit()

            return jsonify({
                "success": True,
                "message": "Guest added successfully"
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

    # UPDATE GUEST
   

    def put(self, guest_id):

        try:

            data = request.get_json()

            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute("""
                UPDATE guests
                SET

                    first_name=%s,
                    last_name=%s,
                    gender=%s,
                    date_of_birth=%s,
                    nationality=%s,

                    email=%s,
                    phone=%s,

                    id_type=%s,
                    id_number=%s,

                    address=%s

                WHERE guest_id=%s
            """, (

                data["first_name"],
                data.get("last_name"),
                data.get("gender"),
                data.get("date_of_birth"),
                data.get("nationality"),

                data["email"],
                data["phone"],

                data["id_type"],
                data["id_number"],

                data.get("address"),

                guest_id

            ))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Guest updated successfully"
            })

        except Exception as e:

            return jsonify({
                "success": False,
                "message": str(e)
            }), 500

    # DELETE GUEST
  

    def delete(self, guest_id):

        try:

            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute("""
                DELETE FROM guests
                WHERE guest_id=%s
            """, (guest_id,))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Guest deleted successfully"
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