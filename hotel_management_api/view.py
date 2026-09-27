from flask import Blueprint

# Import API CLASSES

from .register_api import RegisterAPI
from .login_api import LoginAPI
from .dashboard.user_api import UserAPI
from .dashboard.room_management_api import RoomManagementAPI
from .dashboard.reservation_booking_api import ReservationBookingAPI
from .dashboard.guest_management_api import GuestManagementAPI
from .dashboard.checkin_checkout_api import CheckInCheckOutAPI
from .dashboard.payment_api import PaymentAPI
from .dashboard.housekeeping_management_api import HousekeepingManagementAPI
from .dashboard.report_analytics_api import ReportAnalyticsAPI
from .dashboard.setting_api import SettingAPI
from .dashboard.notification_api import NotificationAPI
from .dashboard.logout_api import LogoutAPI

from .dashboard.guest_auth_api import guest_auth_blueprint


#BLUEPRINT

register_apis_blueprint = Blueprint("register_apis_blueprint", __name__)
login_apis_blueprint = Blueprint("login_apis_blueprint", __name__)
user_apis_blueprint = Blueprint("user", __name__)
room_apis_blueprint = Blueprint("room_apis_blueprint",__name__)
booking_apis_blueprint = Blueprint("booking_apis_blueprint",__name__)
guest_apis_blueprint = Blueprint("guest_apis_blueprint",__name__)
guest_auth_apis_blueprint = Blueprint("guest_auth_apis_blueprint",__name__)
checkin_checkout_apis_blueprint = Blueprint("checkin_checkout_apis_blueprint",__name__)
payment_apis_blueprint = Blueprint("payment_apis_blueprint",__name__)
housekeeping_apis_blueprint = Blueprint("housekeeping_apis_blueprint",__name__)
report_apis_blueprint = Blueprint("report_apis_blueprint",__name__)
setting_apis_blueprint = Blueprint("setting_apis_blueprint",__name__)
notification_apis_blueprint = Blueprint("notification_apis_blueprint",__name__)
logout_apis_blueprint = Blueprint("logout_apis_blueprint", __name__)

register_api = RegisterAPI.as_view("RegisterAPI")
register_apis_blueprint.add_url_rule("/",view_func=register_api,methods=["POST"])

login_api = LoginAPI.as_view("LoginAPI")
login_apis_blueprint.add_url_rule("/",view_func=login_api,methods=["POST"])

user_api = UserAPI.as_view("UserAPI")
user_apis_blueprint.add_url_rule("/",view_func=user_api,methods=["GET", "POST"])
user_apis_blueprint.add_url_rule("/<int:user_id>",view_func=user_api,methods=["GET", "PUT", "DELETE"])

room_api = RoomManagementAPI.as_view("RoomManagementAPI")
room_apis_blueprint.add_url_rule("/",view_func=room_api,methods=["GET", "POST"])
room_apis_blueprint.add_url_rule("/<int:room_id>",view_func=room_api,methods=["GET", "PUT", "DELETE"])


booking_api = ReservationBookingAPI.as_view("ReservationBookingAPI")
booking_apis_blueprint.add_url_rule("/",view_func=booking_api,methods=["GET", "POST"])
booking_apis_blueprint.add_url_rule("/<int:booking_id>",view_func=booking_api,methods=["GET", "PUT", "DELETE"])

guest_api = GuestManagementAPI.as_view("GuestManagementAPI")
guest_apis_blueprint.add_url_rule("/",view_func=guest_api,methods=["GET", "POST"])
guest_apis_blueprint.add_url_rule("/<int:guest_id>",view_func=guest_api,methods=["GET", "PUT", "DELETE"])

stay_api = CheckInCheckOutAPI.as_view("CheckInCheckOutAPI")
checkin_checkout_apis_blueprint.add_url_rule("/",view_func=stay_api,methods=["GET", "POST"])
checkin_checkout_apis_blueprint.add_url_rule("/<int:stay_id>",view_func=stay_api,methods=["GET", "PUT", "DELETE"])

payment_api = PaymentAPI.as_view("PaymentAPI")
payment_apis_blueprint.add_url_rule("/",view_func=payment_api,methods=["GET", "POST"])
payment_apis_blueprint.add_url_rule("/<int:payment_id>",view_func=payment_api,methods=["GET", "PUT", "DELETE"])

housekeeping_api = HousekeepingManagementAPI.as_view("HousekeepingManagementAPI")
housekeeping_apis_blueprint.add_url_rule("/",view_func=housekeeping_api,methods=["GET", "POST"])
housekeeping_apis_blueprint.add_url_rule("/<int:housekeeping_id>",view_func=housekeeping_api,methods=["GET", "PUT", "DELETE"])


report_apis_blueprint.add_url_rule("/",view_func=ReportAnalyticsAPI.as_view("ReportAnalyticsAPI"),methods=["GET"])

setting_api = SettingAPI.as_view("SettingAPI")
setting_apis_blueprint.add_url_rule("/",view_func=setting_api,methods=["GET", "POST"])
setting_apis_blueprint.add_url_rule("/<int:setting_id>",view_func=setting_api,methods=["GET", "PUT", "DELETE"])

notification_api = NotificationAPI.as_view("NotificationAPI")
notification_apis_blueprint.add_url_rule("/",view_func=notification_api,methods=["GET", "POST"])
notification_apis_blueprint.add_url_rule("/<int:notification_id>",view_func=notification_api,methods=["GET", "PUT", "DELETE"])

logout_api = LogoutAPI.as_view("LogoutAPI")
logout_apis_blueprint.add_url_rule("/",view_func=logout_api,methods=["POST"])