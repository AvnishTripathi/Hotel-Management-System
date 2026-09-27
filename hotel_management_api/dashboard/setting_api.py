from flask import request, jsonify
from flask.views import MethodView
from flask import Blueprint
from utils.connection import get_connection

setting_apis_blueprint = Blueprint(
    "setting_apis_blueprint",
    __name__
)


class SettingAPI(MethodView):

    def _safe_int(self, value):
        try:
            return int(value) if value not in (None, "") else None
        except (ValueError, TypeError):
            return None

    def _safe_float(self, value, default=0):
        try:
            return float(value) if value not in (None, "") else default
        except (ValueError, TypeError):
            return default

    # GET SETTINGS

    def get(self, setting_id=None):

        conn = None
        cursor = None

        try:

            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            if setting_id:

                cursor.execute("""
                    SELECT *
                    FROM settings
                    WHERE setting_id=%s
                """, (setting_id,))

                setting = cursor.fetchone()

                if not setting:
                    return jsonify({
                        "success": False,
                        "message": "Setting not found"
                    }), 404

                return jsonify({
                    "success": True,
                    "data": setting
                }), 200

            cursor.execute("""
                SELECT *
                FROM settings
                ORDER BY setting_id DESC
            """)

            settings = cursor.fetchall()

            return jsonify({
                "success": True,
                "count": len(settings),
                "data": settings
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

    # CREATE SETTINGS

    def post(self):

        conn = None
        cursor = None

        try:

            data = request.get_json()

            smtp_port = self._safe_int(
                data.get("smtp_port")
            )

            tax_percentage = self._safe_float(
                data.get("tax_percentage")
            )

            service_charge_percentage = self._safe_float(
                data.get("service_charge_percentage")
            )

            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute("""
                INSERT INTO settings(

                    hotel_name,
                    hotel_code,
                    hotel_email,
                    hotel_phone,
                    hotel_address,
                    hotel_website,
                    hotel_logo,
                    currency,
                    tax_percentage,
                    service_charge_percentage,
                    payment_methods,
                    smtp_host,
                    smtp_port,
                    smtp_email,
                    smtp_password,
                    sms_provider,
                    sms_api_key,
                    timezone,
                    date_format,
                    language,
                    maintenance_mode

                )
                VALUES(
                    %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
                    %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s
                )
            """, (

                data.get("hotel_name"),
                data.get("hotel_code"),
                data.get("hotel_email"),
                data.get("hotel_phone"),
                data.get("hotel_address"),
                data.get("hotel_website"),
                data.get("hotel_logo"),
                data.get("currency", "INR"),
                tax_percentage,
                service_charge_percentage,
                data.get("payment_methods"),
                data.get("smtp_host"),
                smtp_port,
                data.get("smtp_email"),
                data.get("smtp_password"),
                data.get("sms_provider"),
                data.get("sms_api_key"),
                data.get("timezone", "Asia/Kolkata"),
                data.get("date_format", "DD-MM-YYYY"),
                data.get("language", "English"),
                data.get("maintenance_mode", "NO")

            ))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Settings created successfully",
                "setting_id": cursor.lastrowid
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

    # UPDATE SETTINGS

    def put(self, setting_id):

        conn = None
        cursor = None

        try:

            data = request.get_json()

            smtp_port = self._safe_int(
                data.get("smtp_port")
            )

            tax_percentage = self._safe_float(
                data.get("tax_percentage")
            )

            service_charge_percentage = self._safe_float(
                data.get("service_charge_percentage")
            )

            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute("""
                UPDATE settings
                SET

                    hotel_name=%s,
                    hotel_code=%s,
                    hotel_email=%s,
                    hotel_phone=%s,
                    hotel_address=%s,
                    hotel_website=%s,
                    hotel_logo=%s,
                    currency=%s,
                    tax_percentage=%s,
                    service_charge_percentage=%s,
                    payment_methods=%s,
                    smtp_host=%s,
                    smtp_port=%s,
                    smtp_email=%s,
                    smtp_password=%s,
                    sms_provider=%s,
                    sms_api_key=%s,
                    timezone=%s,
                    date_format=%s,
                    language=%s,
                    maintenance_mode=%s

                WHERE setting_id=%s
            """, (

                data.get("hotel_name"),
                data.get("hotel_code"),
                data.get("hotel_email"),
                data.get("hotel_phone"),
                data.get("hotel_address"),
                data.get("hotel_website"),
                data.get("hotel_logo"),
                data.get("currency", "INR"),
                tax_percentage,
                service_charge_percentage,
                data.get("payment_methods"),
                data.get("smtp_host"),
                smtp_port,
                data.get("smtp_email"),
                data.get("smtp_password"),
                data.get("sms_provider"),
                data.get("sms_api_key"),
                data.get("timezone", "Asia/Kolkata"),
                data.get("date_format", "DD-MM-YYYY"),
                data.get("language", "English"),
                data.get("maintenance_mode", "NO"),
                setting_id

            ))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Settings updated successfully"
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

    # DELETE SETTINGS

    def delete(self, setting_id):

        conn = None
        cursor = None

        try:

            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute("""
                DELETE FROM settings
                WHERE setting_id=%s
            """, (setting_id,))

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Settings deleted successfully"
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