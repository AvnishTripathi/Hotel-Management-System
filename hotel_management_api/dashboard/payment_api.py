from flask import request, jsonify
from flask.views import MethodView
from flask import Blueprint
from utils.connection import get_connection

payment_apis_blueprint = Blueprint(
    "payment_apis_blueprint",
    __name__
)


class PaymentAPI(MethodView):

    # GET PAYMENT(S)

    def get(self, payment_id=None):

        conn = None
        cursor = None

        try:

            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            if payment_id:

                cursor.execute("""
                    SELECT *
                    FROM payments
                    WHERE payment_id=%s
                """, (payment_id,))

                payment = cursor.fetchone()

                if not payment:
                    return jsonify({
                        "success": False,
                        "message": "Payment not found"
                    }), 404

                return jsonify({
                    "success": True,
                    "data": payment
                }), 200

            cursor.execute("""
                SELECT *
                FROM payments
                ORDER BY payment_id DESC
            """)

            payments = cursor.fetchall()

            return jsonify({
                "success": True,
                "count": len(payments),
                "data": payments
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

    # CREATE PAYMENT

    def post(self):

        conn = None
        cursor = None

        try:

            data = request.get_json()

            conn = get_connection()
            cursor = conn.cursor()

            room_charge = float(data.get("room_charge", 0))
            food_charge = float(data.get("food_charge", 0))
            laundry_charge = float(data.get("laundry_charge", 0))
            service_charge = float(data.get("service_charge", 0))
            other_charge = float(data.get("other_charge", 0))
            discount_amount = float(data.get("discount_amount", 0))
            tax_amount = float(data.get("tax_amount", 0))
            paid_amount = float(data.get("paid_amount", 0))

            total_amount = (
                room_charge
                + food_charge
                + laundry_charge
                + service_charge
                + other_charge
                + tax_amount
                - discount_amount
            )

            balance_amount = total_amount - paid_amount

            cursor.execute("""
                INSERT INTO payments(
                    stay_id,
                    invoice_number,
                    room_charge,
                    food_charge,
                    laundry_charge,
                    service_charge,
                    other_charge,
                    discount_amount,
                    tax_amount,
                    total_amount,
                    paid_amount,
                    balance_amount,
                    payment_method,
                    payment_status,
                    payment_date,
                    remarks
                )
                VALUES(
                    %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW(),%s
                )
            """, (
                data["stay_id"],
                data["invoice_number"],
                room_charge,
                food_charge,
                laundry_charge,
                service_charge,
                other_charge,
                discount_amount,
                tax_amount,
                total_amount,
                paid_amount,
                balance_amount,
                data.get("payment_method", "CASH"),
                data.get("payment_status", "PENDING"),
                data.get("remarks")
            ))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Payment created successfully",
                "payment_id": cursor.lastrowid
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

    
    # UPDATE PAYMENT
 

    def put(self, payment_id):

        conn = None
        cursor = None

        try:

            data = request.get_json()

            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute("""
                UPDATE payments
                SET
                    paid_amount=%s,
                    payment_method=%s,
                    payment_status=%s,
                    remarks=%s
                WHERE payment_id=%s
            """, (
                data["paid_amount"],
                data["payment_method"],
                data["payment_status"],
                data.get("remarks"),
                payment_id
            ))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Payment updated successfully"
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

    # REFUND PAYMENT
  

    def delete(self, payment_id):

        conn = None
        cursor = None

        try:

            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute("""
                UPDATE payments
                SET
                    payment_status='REFUNDED',
                    refund_amount=paid_amount
                WHERE payment_id=%s
            """, (payment_id,))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Payment refunded successfully"
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