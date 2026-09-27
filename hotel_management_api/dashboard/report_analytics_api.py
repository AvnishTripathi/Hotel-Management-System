from flask import request, jsonify
from flask.views import MethodView
from flask import Blueprint
from utils.connection import get_connection

report_apis_blueprint = Blueprint("report_apis_blueprint",__name__)

class ReportAnalyticsAPI(MethodView):

    def get(self):

        try:

            report_type = request.args.get("report_type")

            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            # OCCUPANCY REPORT

            if report_type == "occupancy":

                cursor.execute("""
                    SELECT

                        COUNT(*) AS total_rooms,

                        SUM(
                            CASE
                                WHEN room_status='OCCUPIED'
                                THEN 1
                                ELSE 0
                            END
                        ) AS occupied_rooms,

                        SUM(
                            CASE
                                WHEN room_status='AVAILABLE'
                                THEN 1
                                ELSE 0
                            END
                        ) AS available_rooms

                    FROM rooms
                """)

                data = cursor.fetchone()

                occupancy_rate = 0

                if data["total_rooms"] > 0:

                    occupancy_rate = round(
                        (
                            data["occupied_rooms"] /
                            data["total_rooms"]
                        ) * 100,
                        2
                    )

                return jsonify({
                    "success": True,
                    "report": "Occupancy Report",
                    "data": data,
                    "occupancy_rate": occupancy_rate
                })

            # BOOKING REPORT

            elif report_type == "booking":

                cursor.execute("""
                    SELECT

                        booking_status,
                        COUNT(*) AS total_bookings

                    FROM bookings
                    GROUP BY booking_status
                """)

                data = cursor.fetchall()

                return jsonify({
                    "success": True,
                    "report": "Booking Report",
                    "data": data
                })

            # REVENUE REPORT

            elif report_type == "revenue":

                cursor.execute("""
                    SELECT

                        COUNT(*) AS total_payments,

                        SUM(total_amount)
                        AS total_revenue,

                        SUM(
                            CASE
                                WHEN payment_status='PAID'
                                THEN total_amount
                                ELSE 0
                            END
                        ) AS collected_revenue

                    FROM payments
                """)

                data = cursor.fetchone()

                return jsonify({
                    "success": True,
                    "report": "Revenue Report",
                    "data": data
                })

            # GUEST REPORT

            elif report_type == "guest":

                cursor.execute("""
                    SELECT

                        COUNT(*) AS total_guests

                    FROM guests
                """)

                guest_count = cursor.fetchone()

                cursor.execute("""
                    SELECT
                        nationality,
                        COUNT(*) AS total
                    FROM guests
                    GROUP BY nationality
                """)

                nationality_data = cursor.fetchall()

                return jsonify({
                    "success": True,
                    "report": "Guest Report",
                    "summary": guest_count,
                    "nationality_data": nationality_data
                })

            return jsonify({
                "success": False,
                "message": "Invalid report type"
            }), 400

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