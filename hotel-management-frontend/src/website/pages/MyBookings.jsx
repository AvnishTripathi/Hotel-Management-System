import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaBed,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaReceipt,
  FaTimesCircle,
  FaArrowRight,
  FaPlus,
} from "react-icons/fa";
import WebsiteNavbar from "../components/WebsiteNavbar";
import Footer from "../components/Footer";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("guest_token");
    if (!token) {
      navigate("/guest-login");
      return;
    }

    try {
      const saved = JSON.parse(localStorage.getItem("guest_bookings") || "[]");
      setBookings(saved);
    } catch {
      setBookings([]);
    }
  }, [navigate]);

  const handleCancelBooking = (bookingRef) => {
    if (window.confirm(`Are you sure you want to cancel booking #${bookingRef}?`)) {
      const updated = bookings.map((b) =>
        (b.bookingRef === bookingRef || b.paymentId === bookingRef)
          ? { ...b, paymentStatus: "CANCELLED (REFUNDED)" }
          : b
      );
      setBookings(updated);
      localStorage.setItem("guest_bookings", JSON.stringify(updated));
    }
  };

  const handleViewReceipt = (booking) => {
    navigate("/booking-success", { state: booking });
  };

  return (
    <>
      <WebsiteNavbar />

      <div className="page-hero">
        <span className="hero-badge">Guest Portal</span>
        <h1>My Reservations & Itineraries</h1>
        <p>Manage your upcoming palace stays, view digital check-in passes, and print invoices.</p>
      </div>

      <section className="booking-page" style={{ paddingTop: "50px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", margin: 0 }}>
              Active & Past Stays ({bookings.length})
            </h2>
            <Link to="/hotel-rooms" className="btn-book-now" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <FaPlus /> Book New Suite
            </Link>
          </div>

          {bookings.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {bookings.map((booking, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    padding: "24px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                    display: "grid",
                    gridTemplateColumns: "180px 1fr auto",
                    gap: "24px",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={booking.room?.image}
                    alt={booking.room?.name}
                    style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "12px" }}
                  />

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                      <span
                        style={{
                          background: booking.paymentStatus?.includes("CANCELLED")
                            ? "#fee2e2"
                            : "#dcfce7",
                          color: booking.paymentStatus?.includes("CANCELLED")
                            ? "#b91c1c"
                            : "#15803d",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: "999px",
                        }}
                      >
                        {booking.paymentStatus || "CONFIRMED"}
                      </span>
                      <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>
                        Ref: #{booking.bookingRef || "RG-1049"}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: "var(--font-serif)", margin: "0 0 6px 0", fontSize: "1.25rem" }}>
                      {booking.room?.name}
                    </h3>

                    <div style={{ display: "flex", gap: "18px", color: "#475569", fontSize: "0.88rem", flexWrap: "wrap" }}>
                      <span>
                        <FaCalendarAlt style={{ color: "var(--primary-gold)" }} /> {booking.checkIn} → {booking.checkOut}
                      </span>
                      <span>
                        ({booking.nights} Night{booking.nights > 1 ? "s" : ""}, {booking.guests} Guest(s))
                      </span>
                      <span>
                        <FaMoneyBillWave style={{ color: "var(--primary-gold)" }} /> Total: <strong>₹{booking.totalAmount?.toLocaleString()}</strong>
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <button
                      className="btn-details"
                      style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}
                      onClick={() => handleViewReceipt(booking)}
                    >
                      <FaReceipt /> View Voucher
                    </button>

                    {!booking.paymentStatus?.includes("CANCELLED") && (
                      <button
                        className="logout-link-btn"
                        style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}
                        onClick={() => handleCancelBooking(booking.bookingRef || booking.paymentId)}
                      >
                        <FaTimesCircle /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "60px 30px",
                textAlign: "center",
                border: "1px solid #e2e8f0",
              }}
            >
              <FaCalendarCheck style={{ fontSize: "3rem", color: "var(--primary-gold)", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "1.4rem", margin: "0 0 8px 0" }}>No active reservations yet</h3>
              <p style={{ color: "#64748b", margin: "0 0 24px 0" }}>
                Experience luxury living by reserving one of our palatial suites today.
              </p>
              <Link to="/hotel-rooms" className="hero-btn">
                Explore Available Suites <FaArrowRight />
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
