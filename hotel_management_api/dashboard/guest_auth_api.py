from flask import Blueprint, request, jsonify
from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from utils.connection import get_connection

import jwt
import datetime
import uuid
import os

guest_auth_blueprint = Blueprint(
    "guest_auth_blueprint",
    __name__
)

bcrypt = Bcrypt()

JWT_SECRET = os.getenv(
    "JWT_SECRET",
    "hotel-secret-key"
)


@guest_auth_blueprint.route(
    "/register",
    methods=["POST"]
)
def guest_register():
    pass

    conn = None
    cursor = None

    try:

        data = request.get_json()

        required_fields = [
            "first_name",
            "email",
            "phone",
            "password"
        ]

        for field in required_fields:

            if not data.get(field):

                return jsonify({
                    "success": False,
                    "message": f"{field} is required"
                }), 400

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT guest_id
            FROM guests
            WHERE email=%s
            """,
            (data["email"],)
        )

        existing_guest = cursor.fetchone()

        if existing_guest:

            return jsonify({
                "success": False,
                "message": "Email already registered"
            }), 400

        password_hash = bcrypt.generate_password_hash(
            data["password"]
        ).decode("utf-8")

        guest_code = (
            "GST-" +
            str(uuid.uuid4()).split("-")[0].upper()
        )

        cursor.execute("""
            INSERT INTO guests (

                guest_code,
                first_name,
                last_name,
                email,
                phone,
                password_hash

            )
            VALUES (%s,%s,%s,%s,%s,%s)
        """, (

            guest_code,
            data["first_name"],
            data.get("last_name"),
            data["email"],
            data["phone"],
            password_hash

        ))

        conn.commit()

        return jsonify({
            "success": True,
            "message": "Registration successful"
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

@guest_auth_blueprint.route(
    "/login",
    methods=["POST"]
)
def guest_login():
    pass

    conn = None
    cursor = None

    try:

        data = request.get_json()

        if not data.get("email") or not data.get("password"):

            return jsonify({
                "success": False,
                "message": "Email and password are required"
            }), 400

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT *
            FROM guests
            WHERE email=%s
            AND status='ACTIVE'
        """, (data["email"],))

        guest = cursor.fetchone()

        if not guest:

            return jsonify({
                "success": False,
                "message": "Invalid credentials"
            }), 401

        if not bcrypt.check_password_hash(
            guest["password_hash"],
            data["password"]
        ):

            return jsonify({
                "success": False,
                "message": "Invalid credentials"
            }), 401

        token = jwt.encode(
            {
                "guest_id": guest["guest_id"],
                "email": guest["email"],
                "exp": datetime.datetime.utcnow()
                + datetime.timedelta(days=7)
            },
            JWT_SECRET,
            algorithm="HS256"
        )

        cursor.execute("""
            UPDATE guests
            SET last_login = CURRENT_TIMESTAMP
            WHERE guest_id = %s
        """, (guest["guest_id"],))

        conn.commit()

        return jsonify({
            "success": True,
            "message": "Login successful",
            "token": token,
            "guest": {
                "guest_id": guest["guest_id"],
                "first_name": guest["first_name"],
                "email": guest["email"]
            }
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