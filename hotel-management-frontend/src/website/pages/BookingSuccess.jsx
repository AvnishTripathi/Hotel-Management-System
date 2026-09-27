import { Link, useLocation, Navigate } from "react-router-dom";
import {
  FaCheck,
  FaPrint,
  FaHome,
  FaBed,
  FaCalendarCheck,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaCalendarPlus,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import WebsiteNavbar from "../components/WebsiteNavbar";
import Footer from "../components/Footer";
import { hotelInfo } from "../data/hotelData";

export default function BookingSuccess() {
  const { state } = useLocation();

  if (!state) {
    return <Navigate to="/hotel-rooms" replace />;
  }

  const handlePrint = () => {
    window.print();
  };

  const invoiceNo = state.invoiceNo || `INV-RG-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const bookingRef = state.bookingRef || `RG-${Date.now().toString().slice(-6)}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    `CONFIRMATION|${bookingRef}|${invoiceNo}|${state.guestName}|${state.checkIn}|${state.room?.name}`
  )}`;

  // Google Calendar Link generator
  const createGoogleCalendarLink = () => {
    const title = encodeURIComponent(`Stay at Royal Grand Hotel (${state.room?.name})`);
    const details = encodeURIComponent(
      `Reservation Ref: #${bookingRef}\nInvoice: #${invoiceNo}\nGuest: ${state.guestName}\nTotal Paid: ₹${state.totalAmount?.toLocaleString()}\nAddress: ${hotelInfo.address}\nPhone: ${hotelInfo.phone}`
    );
    const location = encodeURIComponent(hotelInfo.address);
    const checkInClean = state.checkIn.replace(/-/g, "");
    const checkOutClean = state.checkOut.replace(/-/g, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${checkInClean}T140000Z/${checkOutClean}T120000Z&details=${details}&location=${location}`;
  };

  const isPaid = state.paymentStatus?.includes("PAID") || state.paymentStatus?.includes("VERIFIED");

  // Calculate tax breakdown
  const grandTotal = state.totalAmount || (state.nights * (state.room?.price || 0));
  const preTaxAmount = Math.round(grandTotal / 1.12);
  const totalTax = grandTotal - preTaxAmount;
  const cgst = Math.round(totalTax / 2);
  const sgst = totalTax - cgst;

  return (
    <>
      <WebsiteNavbar />

      <div className="booking-page">
        <div className="success-receipt-card" id="tax-invoice-voucher">
          {/* Header Banner */}
          <div className="success-header-banner">
            <div className="success-check-icon">
              <FaCheck />
            </div>
            <h1>Reservation Confirmed!</h1>
            <p style={{ color: "#fce79a", margin: "6px 0 0 0", fontSize: "1.1rem" }}>
              Booking Reference: <strong>#{bookingRef}</strong> • Invoice: <strong>#{invoiceNo}</strong>
            </p>
            <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
              An official voucher & tax receipt has been emailed to <strong>{state.email}</strong>
            </span>
          </div>

          {/* Details Body */}
          <div className="receipt-details-body">
            {/* Hotel & Invoice Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "20px",
                paddingBottom: "20px",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--primary-gold)", letterSpacing: "1px" }}>
                  Official Hotel Voucher & Tax Invoice
                </span>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", margin: "2px 0 6px 0", color: "#0b111e" }}>
                  {hotelInfo.name}
                </h2>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaMapMarkerAlt style={{ color: "var(--primary-gold)" }} /> {hotelInfo.address}
                </p>
                <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>
                  GSTIN: <strong>07AAAAA0000A1Z5</strong> | SAC Code: <strong>996311 (Accommodation)</strong>
                </div>
              </div>

              <div style={{ textAlign: "center", background: "#f8fafc", padding: "10px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <img
                  src={qrUrl}
                  alt="Check-in QR"
                  style={{ width: "95px", height: "95px", display: "block" }}
                />
                <div style={{ fontSize: "0.68rem", color: "#0b111e", marginTop: "4px", fontWeight: 800 }}>
                  EXPRESS CHECK-IN PASS
                </div>
              </div>
            </div>

            {/* Guest & Stay Itemization Grid */}
            <div className="receipt-grid">
              <div className="receipt-field">
                <span>Guest Name</span>
                <strong>{state.guestName}</strong>
              </div>

              <div className="receipt-field">
                <span>Contact & Email</span>
                <strong>{state.phone} / {state.email}</strong>
              </div>

              <div className="receipt-field">
                <span>Reserved Suite</span>
                <strong style={{ color: "var(--primary-gold-hover)" }}>
                  <FaBed /> {state.room?.name}
                </strong>
              </div>

              <div className="receipt-field">
                <span>Suite View & Bed</span>
                <strong>{state.room?.bed || "King Bed"} ({state.room?.view || "City View"})</strong>
              </div>

              <div className="receipt-field">
                <span>Check-In Date</span>
                <strong>{state.checkIn} (from {hotelInfo.checkInTime})</strong>
              </div>

              <div className="receipt-field">
                <span>Check-Out Date</span>
                <strong>{state.checkOut} (until {hotelInfo.checkOutTime})</strong>
              </div>

              <div className="receipt-field">
                <span>Duration of Stay</span>
                <strong>{state.nights} Night{state.nights > 1 ? "s" : ""} • {state.guests} Guest(s)</strong>
              </div>

              <div className="receipt-field">
                <span>Payment Mode</span>
                <strong>{state.paymentMethod || "Online Gateway"}</strong>
              </div>

              <div className="receipt-field">
                <span>Transaction Reference</span>
                <strong>{state.paymentId}</strong>
              </div>

              <div className="receipt-field">
                <span>Settlement Status</span>
                <strong style={{ color: isPaid ? "#16a34a" : "#2563eb" }}>
                  {isPaid ? "✓ PAID & SETTLED (VERIFIED)" : "⏳ PENDING (PAY AT FRONT DESK)"}
                </strong>
              </div>
            </div>

            {/* Inclusions summary */}
            <div
              style={{
                background: "#f8fafc",
                padding: "16px 20px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                marginBottom: "20px",
              }}
            >
              <div style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: "6px" }}>
                Included Privileges & Booking Inclusions
              </div>
              <div style={{ fontSize: "0.88rem", color: "#334155", lineHeight: "1.6" }}>
                • Complimentary Royal Buffet Breakfast served daily at The Grand Pavilion (07:00 AM - 10:30 AM)<br />
                • Unlimited High-Speed Starlink Wi-Fi across suites and private gardens<br />
                • Access to Temperature-Controlled Infinity Pool, Steam Room, and Technogym Fitness Studio
              </div>
            </div>

            {/* Itemized Tax Breakdown Table */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "#475569", marginBottom: "6px" }}>
                <span>Base Suite Tariff & Inclusions:</span>
                <span>₹{preTaxAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "#64748b", marginBottom: "4px" }}>
                <span>CGST (6% Hospitality Tax):</span>
                <span>+₹{cgst.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "#64748b", marginBottom: "8px" }}>
                <span>SGST (6% State Hospitality Tax):</span>
                <span>+₹{sgst.toLocaleString()}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "10px",
                  borderTop: "2px solid #e2e8f0",
                }}
              >
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0b111e" }}>Grand Total Amount</span>
                <span style={{ fontSize: "1.7rem", fontWeight: 800, color: "#0b111e" }}>
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="receipt-actions" style={{ flexWrap: "wrap" }}>
              <button
                type="button"
                className="hero-btn"
                style={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                onClick={handlePrint}
              >
                <FaPrint /> Print / Download Tax Invoice (PDF)
              </button>

              <a
                href={createGoogleCalendarLink()}
                target="_blank"
                rel="noreferrer"
                className="hero-secondary-btn"
                style={{
                  background: "#ffffff",
                  color: "#1e293b",
                  borderColor: "#cbd5e1",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                }}
              >
                <FaCalendarPlus /> Add to Calendar
              </a>

              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(
                  `Hi Royal Grand Concierge, I have confirmed reservation #${bookingRef} under ${state.guestName}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="hero-secondary-btn"
                style={{
                  background: "#25D366",
                  color: "#ffffff",
                  borderColor: "#25D366",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                }}
              >
                <FaWhatsapp /> Concierge WhatsApp
              </a>

              <Link
                to="/my-bookings"
                className="hero-secondary-btn"
                style={{
                  background: "#0b111e",
                  color: "var(--primary-gold)",
                  borderColor: "var(--primary-gold)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaCalendarCheck /> My Bookings
              </Link>

              <Link
                to="/"
                className="hero-secondary-btn"
                style={{
                  color: "#334155",
                  borderColor: "#cbd5e1",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaHome /> Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}