import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../website/pages/Home";
import About from "../website/pages/About";
import Contact from "../website/pages/Contact";
import WebsiteRooms from "../website/pages/WebsiteRooms";
import BookingPage from "../website/pages/BookingPage";
import BookingSuccess from "../website/pages/BookingSuccess";
import PaymentPage from "../website/pages/PaymentPage";
import GuestRegister from "../website/pages/GuestRegister";
import GuestLogin from "../website/pages/GuestLogin";
import MyBookings from "../website/pages/MyBookings";

import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Rooms from "../pages/Rooms";
import Guests from "../pages/Guests";
import Bookings from "../pages/Bookings";
import Stays from "../pages/Stays";
import Payments from "../pages/Payments";
import Housekeeping from "../pages/Housekeeping";
import ReportAnalytics from "../pages/ReportAnalytics";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";

import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/hotel-rooms" element={<WebsiteRooms />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/booking-success" element={<BookingSuccess />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/guest-register" element={<GuestRegister />} />
      <Route path="/guest-login" element={<GuestLogin />} />
      <Route path="/my-bookings" element={<MyBookings />} />

      {/* Admin Management System Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rooms"
        element={
          <ProtectedRoute>
            <Rooms />
          </ProtectedRoute>
        }
      />

      <Route
        path="/guests"
        element={
          <ProtectedRoute>
            <Guests />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <Bookings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/stays"
        element={
          <ProtectedRoute>
            <Stays />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/housekeeping"
        element={
          <ProtectedRoute>
            <Housekeeping />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportAnalytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;