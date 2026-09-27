import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaCreditCard,
  FaMobileAlt,
  FaUniversity,
  FaMoneyBillWave,
  FaLock,
  FaShieldAlt,
  FaCheckCircle,
  FaClock,
  FaQrcode,
  FaBolt,
  FaArrowLeft,
  FaTimes,
  FaKey,
} from "react-icons/fa";
import WebsiteNavbar from "../components/WebsiteNavbar";
import Footer from "../components/Footer";
import api from "../../api/api";

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Countdown timer for payment session (10:00)
  const [timeLeft, setTimeLeft] = useState(600);

  // OTP Modal State for NetBanking / 2FA
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState("123456");

  // Card Form State
  const [cardData, setCardData] = useState({
    number: "4532 8901 2345 6789",
    expiry: "09/29",
    cvv: "888",
    name: state?.guestName || "Eleanor Vance",
  });

  const [cardBrand, setCardBrand] = useState("VISA");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [upiId, setUpiId] = useState("guest@okaxis");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 16);
    // detect brand
    if (val.startsWith("4")) setCardBrand("VISA");
    else if (val.startsWith("5")) setCardBrand("MASTERCARD");
    else if (val.startsWith("3")) setCardBrand("AMEX");
    else if (val.startsWith("6")) setCardBrand("RUPAY");
    else setCardBrand("CARD");

    const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    setCardData({ ...cardData, number: formatted });
  };

  if (!state) {
    return (
      <>
        <WebsiteNavbar />
        <div className="booking-page" style={{ textAlign: "center" }}>
          <div className="payment-gateway-wrapper">
            <h2>No active booking session found</h2>
            <p style={{ color: "#64748b" }}>Please select a suite to initiate reservation.</p>
            <button
              className="hero-btn"
              onClick={() => navigate("/hotel-rooms")}
              style={{ marginTop: "20px" }}
            >
              Browse Suites
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const bookingRef = state.bookingRef || `RG-${Date.now().toString().slice(-6)}`;
  const upiLink = `upi://pay?pa=royalgrandhotel@icici&pn=RoyalGrandHotel&am=${state.totalAmount}&cu=INR&tn=Booking_${bookingRef}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    upiLink
  )}`;

  const finalizeBooking = (methodName, statusText) => {
    const paymentId = `PAY-RG-${Date.now().toString().slice(-8)}`;
    const invoiceNo = `INV-RG-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const completedBooking = {
      ...state,
      bookingRef,
      invoiceNo,
      paymentId,
      paymentStatus: statusText,
      paymentMethod: methodName,
      transactionTime: new Date().toLocaleString(),
      gstin: "07AAAAA0000A1Z5",
      sacCode: "996311",
    };

    // Save to localStorage guest history
    try {
      const existingBookings = JSON.parse(localStorage.getItem("guest_bookings") || "[]");
      existingBookings.unshift(completedBooking);
      localStorage.setItem("guest_bookings", JSON.stringify(existingBookings));
    } catch {
      // ignore
    }

    // Optional: send to backend API if reachable
    try {
      api.post("/payments/", {
        booking_id: bookingRef,
        amount: state.totalAmount,
        payment_method: methodName,
        payment_status: statusText,
      }).catch(() => {});
    } catch {
      // ignore
    }

    setLoading(false);
    navigate("/booking-success", { state: completedBooking });
  };

  const handleCardPayment = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("Connecting to 3D-Secure Payment Gateway...");

    setTimeout(() => {
      setStatusMessage("Verifying Card Issuer & 256-Bit Cryptography...");
      setTimeout(() => {
        finalizeBooking(`Credit/Debit Card (${cardBrand})`, "PAID (VERIFIED)");
      }, 1200);
    }, 1000);
  };

  const handleUpiPayment = () => {
    setLoading(true);
    setStatusMessage("Listening for UPI Webhook Callback & VPA Settlement...");

    setTimeout(() => {
      setStatusMessage("Payment Verified via NPCI UPI Gateway!");
      setTimeout(() => {
        finalizeBooking("UPI Instant Settlement", "PAID (VERIFIED)");
      }, 1000);
    }, 1800);
  };

  const handleNetBankingInitiate = () => {
    setShowOtpModal(true);
  };

  const handleVerifyOtpAndPay = (e) => {
    e.preventDefault();
    setShowOtpModal(false);
    setLoading(true);
    setStatusMessage(`Authenticating 2FA with ${selectedBank}...`);

    setTimeout(() => {
      finalizeBooking(`Net Banking (${selectedBank})`, "PAID (VERIFIED)");
    }, 1500);
  };

  const handlePayAtHotel = () => {
    setLoading(true);
    setStatusMessage("Holding Suite Reservation with Guaranteed Check-In Status...");

    setTimeout(() => {
      finalizeBooking("Pay at Hotel / Front Desk", "PENDING (PAY AT DESK)");
    }, 1200);
  };

  const topBanks = ["HDFC Bank", "State Bank of India", "ICICI Bank", "Axis Bank", "Kotak Bank", "Punjab National Bank"];

  return (
    <>
      <WebsiteNavbar />

      <div className="booking-page">
        <div style={{ maxWidth: "650px", margin: "0 auto 16px auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            <FaArrowLeft /> Back to Booking Summary
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: timeLeft < 120 ? "#fee2e2" : "#f1f5f9",
              color: timeLeft < 120 ? "#b91c1c" : "#334155",
              padding: "6px 14px",
              borderRadius: "999px",
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
          >
            <FaClock /> Session Expires: {formatTimer(timeLeft)}
          </div>
        </div>

        <div className="payment-gateway-wrapper">
          <div className="payment-gateway-header">
            <span className="section-subtitle">Real-Time Checkout</span>
            <h1>Secure Payment Gateway</h1>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "8px" }}>
              <span className="security-badge">
                <FaLock /> 256-Bit SSL Encrypted
              </span>
              <span className="security-badge" style={{ background: "#eff6ff", color: "#1d4ed8" }}>
                <FaShieldAlt /> PCI-DSS Level 1 Compliant
              </span>
            </div>
          </div>

          {/* Quick Summary Bar */}
          <div
            style={{
              background: "linear-gradient(135deg, #111a2e 0%, #18233c 100%)",
              borderRadius: "14px",
              padding: "18px 22px",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
              border: "1px solid rgba(212, 175, 55, 0.3)",
            }}
          >
            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--primary-gold)", letterSpacing: "1px" }}>
                Ref: #{bookingRef}
              </div>
              <strong style={{ fontSize: "1.1rem" }}>
                {state.room.name} ({state.nights} Night{state.nights > 1 ? "s" : ""})
              </strong>
              <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "2px" }}>
                Guest: {state.guestName}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--primary-gold)" }}>
                Grand Total
              </div>
              <strong style={{ fontSize: "1.45rem", color: "#ffffff" }}>
                ₹{state.totalAmount.toLocaleString()}
              </strong>
            </div>
          </div>

          {/* Payment Tabs */}
          <div className="payment-tab-buttons">
            <button
              type="button"
              className={`pay-tab-btn ${paymentMethod === "card" ? "active" : ""}`}
              onClick={() => setPaymentMethod("card")}
            >
              <FaCreditCard />
              <span>Cards</span>
            </button>

            <button
              type="button"
              className={`pay-tab-btn ${paymentMethod === "upi" ? "active" : ""}`}
              onClick={() => setPaymentMethod("upi")}
            >
              <FaMobileAlt />
              <span>UPI Instant</span>
            </button>

            <button
              type="button"
              className={`pay-tab-btn ${paymentMethod === "netbanking" ? "active" : ""}`}
              onClick={() => setPaymentMethod("netbanking")}
            >
              <FaUniversity />
              <span>Net Banking</span>
            </button>

            <button
              type="button"
              className={`pay-tab-btn ${paymentMethod === "pay_hotel" ? "active" : ""}`}
              onClick={() => setPaymentMethod("pay_hotel")}
            >
              <FaMoneyBillWave />
              <span>Pay at Hotel</span>
            </button>
          </div>

          {/* TAB 1: CREDIT / DEBIT CARD */}
          {paymentMethod === "card" && (
            <div>
              <div className="credit-card-preview">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="card-chip" />
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontWeight: 800,
                      letterSpacing: "1.5px",
                      color: "var(--primary-gold)",
                      fontSize: "0.95rem",
                    }}
                  >
                    {cardBrand}
                  </span>
                </div>

                <div className="card-number-display">{cardData.number || "•••• •••• •••• ••••"}</div>

                <div className="card-bottom-row">
                  <div>
                    <div style={{ fontSize: "0.65rem", textTransform: "uppercase", opacity: 0.7 }}>Cardholder</div>
                    <div className="card-holder-name">{cardData.name || state.guestName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.65rem", textTransform: "uppercase", opacity: 0.7 }}>Expires</div>
                    <div style={{ fontFamily: "monospace", fontSize: "0.95rem" }}>{cardData.expiry}</div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleCardPayment}>
                <div className="form-field">
                  <label>Card Number (Visa, Mastercard, RuPay, Amex)</label>
                  <input
                    type="text"
                    value={cardData.number}
                    onChange={handleCardNumberChange}
                    placeholder="4532 0000 0000 0000"
                    maxLength="19"
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      maxLength="5"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>CVV / CVC</label>
                    <input
                      type="password"
                      maxLength="4"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      placeholder="•••"
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                    placeholder="Name as printed on card"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="hero-btn"
                  style={{ width: "100%", marginTop: "10px" }}
                  disabled={loading}
                >
                  <FaBolt /> {loading ? statusMessage : `Authorize ₹${state.totalAmount.toLocaleString()} Payment`}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: UPI */}
          {paymentMethod === "upi" && (
            <div style={{ textAlign: "center" }}>
              <h3 style={{ margin: "0 0 6px 0", fontFamily: "var(--font-serif)" }}>
                Instant Dynamic UPI Payment
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.88rem", margin: "0 0 16px 0" }}>
                Scan the real-time QR code or use your preferred UPI application.
              </p>

              <div
                style={{
                  display: "inline-block",
                  padding: "16px",
                  background: "white",
                  borderRadius: "16px",
                  border: "2px solid #e2e8f0",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                }}
              >
                <img
                  src={qrUrl}
                  alt="UPI QR Code"
                  style={{ width: "190px", height: "190px", display: "block" }}
                />
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", marginTop: "8px", display: "block" }}>
                  UPI: royalgrandhotel@icici
                </span>
              </div>

              {/* Mobile Quick Pay Intent Links */}
              <div style={{ marginTop: "18px" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>
                  Quick App Pay (Mobile Users)
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
                  <a
                    href={upiLink}
                    className="btn-details"
                    style={{ background: "#ffffff", border: "1px solid #cbd5e1", fontWeight: 700, fontSize: "0.85rem" }}
                  >
                    Google Pay
                  </a>
                  <a
                    href={upiLink}
                    className="btn-details"
                    style={{ background: "#ffffff", border: "1px solid #5f259f", color: "#5f259f", fontWeight: 700, fontSize: "0.85rem" }}
                  >
                    PhonePe
                  </a>
                  <a
                    href={upiLink}
                    className="btn-details"
                    style={{ background: "#ffffff", border: "1px solid #00b9f1", color: "#002970", fontWeight: 700, fontSize: "0.85rem" }}
                  >
                    Paytm
                  </a>
                  <a
                    href={upiLink}
                    className="btn-details"
                    style={{ background: "#ffffff", border: "1px solid #000000", fontWeight: 700, fontSize: "0.85rem" }}
                  >
                    CRED
                  </a>
                </div>
              </div>

              <div style={{ margin: "20px auto 10px auto", maxWidth: "420px" }}>
                <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "8px" }}>
                  Or enter your Virtual Payment Address (VPA):
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    style={{
                      flexGrow: 1,
                      padding: "10px 14px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                    }}
                  />
                  <button
                    type="button"
                    className="coupon-btn"
                    onClick={handleUpiPayment}
                    disabled={loading}
                  >
                    Verify & Pay
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="hero-btn"
                style={{ width: "100%", marginTop: "14px" }}
                onClick={handleUpiPayment}
                disabled={loading}
              >
                {loading ? statusMessage : `I Have Completed ₹${state.totalAmount.toLocaleString()} UPI Transfer`}
              </button>
            </div>
          )}

          {/* TAB 3: NET BANKING */}
          {paymentMethod === "netbanking" && (
            <div>
              <h3 style={{ margin: "0 0 8px 0", fontFamily: "var(--font-serif)" }}>
                Select Your Bank
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.88rem", margin: "0 0 16px 0" }}>
                Choose from popular banks or select from the full list below:
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                {topBanks.map((b) => (
                  <button
                    type="button"
                    key={b}
                    onClick={() => setSelectedBank(b)}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "8px",
                      border: selectedBank === b ? "2px solid #d4af37" : "1px solid #cbd5e1",
                      background: selectedBank === b ? "rgba(212, 175, 55, 0.08)" : "#ffffff",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      color: selectedBank === b ? "#0b111e" : "#475569",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {selectedBank === b ? "✓ " : "🏦 "} {b}
                  </button>
                ))}
              </div>

              <div className="form-field">
                <label>Other Banks</label>
                <select
                  className="sort-select"
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  style={{ width: "100%", padding: "12px" }}
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Bank">Kotak Mahindra Bank</option>
                  <option value="Punjab National Bank">Punjab National Bank</option>
                  <option value="Bank of Baroda">Bank of Baroda</option>
                  <option value="Canara Bank">Canara Bank</option>
                  <option value="Union Bank of India">Union Bank of India</option>
                  <option value="IndusInd Bank">IndusInd Bank</option>
                  <option value="Federal Bank">Federal Bank</option>
                  <option value="IDBI Bank">IDBI Bank</option>
                </select>
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  padding: "14px",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  color: "#64748b",
                  margin: "16px 0 20px 0",
                }}
              >
                🔒 You will be securely connected to <strong>{selectedBank}</strong> online banking gateway for Two-Factor Authentication.
              </div>

              <button
                type="button"
                className="hero-btn"
                style={{ width: "100%" }}
                onClick={handleNetBankingInitiate}
                disabled={loading}
              >
                {loading ? statusMessage : `Proceed with ${selectedBank} (₹${state.totalAmount.toLocaleString()})`}
              </button>
            </div>
          )}

          {/* TAB 4: PAY AT HOTEL */}
          {paymentMethod === "pay_hotel" && (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.8rem",
                  margin: "0 auto 16px auto",
                }}
              >
                <FaCheckCircle />
              </div>

              <h3 style={{ margin: "0 0 8px 0", fontFamily: "var(--font-serif)" }}>
                Book Now, Pay at Check-In Desk
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.92rem", lineHeight: "1.6", maxWidth: "450px", margin: "0 auto 20px auto" }}>
                Your luxury suite will be immediately locked and guaranteed. You can settle the full tariff via Cash, Credit Card, or UPI directly at our front desk upon arrival.
              </p>

              <div
                style={{
                  background: "#f8fafc",
                  border: "1px dashed #cbd5e1",
                  borderRadius: "10px",
                  padding: "14px",
                  marginBottom: "24px",
                  fontSize: "0.82rem",
                  color: "#334155",
                  textAlign: "left",
                }}
              >
                ✓ Guaranteed late arrival room hold until 11:59 PM<br />
                ✓ Free cancellation up to 48 hours prior to check-in<br />
                ✓ Instant booking voucher generated with check-in QR
              </div>

              <button
                type="button"
                className="hero-btn"
                style={{ width: "100%" }}
                onClick={handlePayAtHotel}
                disabled={loading}
              >
                {loading ? statusMessage : "Confirm Guaranteed Reservation"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2FA NetBanking Simulation Modal */}
      {showOtpModal && (
        <div className="room-modal-overlay" onClick={() => setShowOtpModal(false)}>
          <div className="room-modal" style={{ maxWidth: "420px", padding: "30px" }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowOtpModal(false)}>
              <FaTimes />
            </button>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <FaKey style={{ fontSize: "2rem", color: "var(--primary-gold)", marginBottom: "10px" }} />
              <h3 style={{ margin: "0 0 6px 0", fontFamily: "var(--font-serif)" }}>{selectedBank} 2FA Gateway</h3>
              <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>
                Enter the 6-digit One-Time Password sent to your registered mobile number ending in **4210.
              </p>
            </div>

            <form onSubmit={handleVerifyOtpAndPay}>
              <div className="form-field">
                <input
                  type="text"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  maxLength="6"
                  style={{ textAlign: "center", fontSize: "1.4rem", letterSpacing: "8px", fontWeight: 800 }}
                  required
                />
              </div>

              <button type="submit" className="hero-btn" style={{ width: "100%", marginTop: "10px" }}>
                Confirm & Pay ₹{state.totalAmount.toLocaleString()}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
