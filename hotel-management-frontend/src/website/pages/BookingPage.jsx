import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaUserFriends,
  FaShieldAlt,
  FaTag,
  FaCar,
  FaSpa,
  FaUtensils,
  FaClock,
  FaArrowLeft,
  FaLock,
} from "react-icons/fa";
import WebsiteNavbar from "../components/WebsiteNavbar";
import Footer from "../components/Footer";
import { roomsData } from "../data/hotelData";

export default function BookingPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // If no room is passed in state, pick the first room as default or redirect
  const room = state?.room || roomsData[0];

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const initialCheckIn = state?.searchParams?.checkIn || todayStr;
  const initialCheckOut = state?.searchParams?.checkOut || tomorrowStr;
  const initialGuests = state?.searchParams?.guests || "2";

  // Check auth
  useEffect(() => {
    const token = localStorage.getItem("guest_token");
    if (!token) {
      navigate("/guest-login", { state: { room } });
    }
  }, [navigate, room]);

  const [formData, setFormData] = useState({
    guestName: "",
    email: "",
    phone: "",
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
    guests: initialGuests,
    requests: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("guest_user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setFormData((prev) => ({
          ...prev,
          guestName: prev.guestName || `${u.first_name || ""} ${u.last_name || ""}`.trim() || "Valued Guest",
          email: prev.email || u.email || "",
          phone: prev.phone || u.phone || "",
        }));
      } catch {
        // fallback
      }
    }
  }, []);

  const [promoCode, setPromoCode] = useState(state?.promoCode || "");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");

  const [addons, setAddons] = useState({
    airportTransfer: false,
    spaSession: false,
    dinner: false,
    lateCheckout: false,
  });

  const addonPrices = {
    airportTransfer: 1500,
    spaSession: 2500,
    dinner: 3500,
    lateCheckout: 999,
  };

  const handleAddonToggle = (key) => {
    setAddons((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === "ROYAL20") {
      setAppliedPromo({ code, discountPercent: 20 });
      setPromoError("");
    } else if (code === "ROMANCE25") {
      setAppliedPromo({ code, discountPercent: 25 });
      setPromoError("");
    } else if (code === "WELCOME10" || code === "EARLY15") {
      setAppliedPromo({ code, discountPercent: 15 });
      setPromoError("");
    } else {
      setPromoError("Invalid or expired coupon code.");
      setAppliedPromo(null);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Calculations
  const checkInDate = new Date(formData.checkIn);
  const checkOutDate = new Date(formData.checkOut);
  const diffTime = checkOutDate - checkInDate;
  const rawNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const nights = rawNights > 0 ? rawNights : 1;

  const baseRoomTotal = nights * room.price;

  let totalAddons = 0;
  if (addons.airportTransfer) totalAddons += addonPrices.airportTransfer;
  if (addons.spaSession) totalAddons += addonPrices.spaSession;
  if (addons.dinner) totalAddons += addonPrices.dinner;
  if (addons.lateCheckout) totalAddons += addonPrices.lateCheckout;

  const subtotal = baseRoomTotal + totalAddons;
  const discountAmount = appliedPromo ? Math.round((subtotal * appliedPromo.discountPercent) / 100) : 0;
  const taxableAmount = subtotal - discountAmount;
  const gstTax = Math.round(taxableAmount * 0.12);
  const grandTotal = taxableAmount + gstTax;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      alert("Check-out date must be strictly after the check-in date.");
      return;
    }

    const bookingPayload = {
      room,
      ...formData,
      nights,
      baseRoomTotal,
      addons,
      totalAddons,
      appliedPromo,
      discountAmount,
      gstTax,
      totalAmount: grandTotal,
      bookingRef: `RG-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };

    navigate("/payment", {
      state: bookingPayload,
    });
  };

  return (
    <>
      <WebsiteNavbar />

      <div className="booking-page">
        <div style={{ maxWidth: "1180px", margin: "0 auto 20px auto" }}>
          <Link
            to="/hotel-rooms"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-muted)",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            <FaArrowLeft /> Change Suite Selection
          </Link>
        </div>

        <div className="booking-container">
          {/* Left Column: Booking Form */}
          <div className="contact-form-container" style={{ padding: "34px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontFamily: "var(--font-serif)" }}>Guest & Stay Details</h2>
              <span className="security-badge">
                <FaLock /> SSL Secure Checkout
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Lead Guest Full Name *</label>
                <input
                  type="text"
                  name="guestName"
                  placeholder="e.g. Eleanor Vance"
                  value={formData.guestName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label>Email Address for Confirmation *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="eleanor@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Contact Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label>Check-In Date *</label>
                  <input
                    type="date"
                    name="checkIn"
                    min={todayStr}
                    value={formData.checkIn}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Check-Out Date *</label>
                  <input
                    type="date"
                    name="checkOut"
                    min={formData.checkIn || todayStr}
                    value={formData.checkOut}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Number of Guests *</label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                >
                  <option value="1">1 Adult (Solo)</option>
                  <option value="2">2 Adults (Couple)</option>
                  <option value="3">3 Guests (Family)</option>
                  <option value="4">4+ Guests (Suite Capacity)</option>
                </select>
              </div>

              {/* Addons Selection */}
              <div className="addons-section">
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "8px" }}>
                  Enhance Your Royal Stay (Optional Add-ons)
                </label>

                <div
                  className="addon-option"
                  onClick={() => handleAddonToggle("airportTransfer")}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={addons.airportTransfer}
                      onChange={() => {}}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "6px" }}>
                        <FaCar style={{ color: "var(--primary-gold)" }} /> Luxury Airport Chauffeur Transfer
                      </div>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        Private executive sedan pickup with baggage assistance
                      </span>
                    </div>
                  </div>
                  <strong style={{ fontSize: "0.9rem" }}>+₹{addonPrices.airportTransfer.toLocaleString()}</strong>
                </div>

                <div
                  className="addon-option"
                  onClick={() => handleAddonToggle("spaSession")}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={addons.spaSession}
                      onChange={() => {}}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "6px" }}>
                        <FaSpa style={{ color: "var(--primary-gold)" }} /> Royal Ayurvedic Spa Therapy (60 min)
                      </div>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        Couples signature rejuvenating herbal oil treatment
                      </span>
                    </div>
                  </div>
                  <strong style={{ fontSize: "0.9rem" }}>+₹{addonPrices.spaSession.toLocaleString()}</strong>
                </div>

                <div
                  className="addon-option"
                  onClick={() => handleAddonToggle("dinner")}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={addons.dinner}
                      onChange={() => {}}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "6px" }}>
                        <FaUtensils style={{ color: "var(--primary-gold)" }} /> 4-Course Candlelight Sky Terrace Dinner
                      </div>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        Chef-crafted menu with premium vintage wine pairing
                      </span>
                    </div>
                  </div>
                  <strong style={{ fontSize: "0.9rem" }}>+₹{addonPrices.dinner.toLocaleString()}</strong>
                </div>

                <div
                  className="addon-option"
                  onClick={() => handleAddonToggle("lateCheckout")}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={addons.lateCheckout}
                      onChange={() => {}}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "6px" }}>
                        <FaClock style={{ color: "var(--primary-gold)" }} /> Guaranteed Late Check-Out (4:00 PM)
                      </div>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        Enjoy extra leisure hours in your suite
                      </span>
                    </div>
                  </div>
                  <strong style={{ fontSize: "0.9rem" }}>+₹{addonPrices.lateCheckout.toLocaleString()}</strong>
                </div>
              </div>

              <div className="form-field">
                <label>Special In-Room Requests / Dietary Requirements</label>
                <textarea
                  name="requests"
                  rows="3"
                  placeholder="e.g. Feather-free pillows, honeymoon floral setup, quiet high-floor room..."
                  value={formData.requests}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="hero-btn"
                style={{ width: "100%", marginTop: "10px" }}
              >
                Proceed to Secure Payment (₹{grandTotal.toLocaleString()})
              </button>
            </form>
          </div>

          {/* Right Column: Sticky Summary Card */}
          <div className="booking-summary-card">
            <img
              src={room.image}
              alt={room.name}
              className="booking-room-thumb"
            />

            <div className="booking-summary-content">
              <span className="room-category">{room.category} Suite</span>
              <h3>{room.name}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0 0 14px 0" }}>
                {room.bed} • {room.view}
              </p>

              <div className="booking-dates-summary">
                <div className="date-box">
                  <span>Check-In</span>
                  <strong>{formData.checkIn}</strong>
                </div>
                <div className="date-box">
                  <span>Check-Out</span>
                  <strong>{formData.checkOut}</strong>
                </div>
                <div className="date-box" style={{ gridColumn: "span 2", borderTop: "1px dashed #e2e8f0", paddingTop: "8px" }}>
                  <span>Duration</span>
                  <strong>{nights} Night{nights > 1 ? "s" : ""} • {formData.guests} Guest(s)</strong>
                </div>
              </div>

              {/* Promo Code Box */}
              <form onSubmit={handleApplyPromo} className="coupon-box">
                <input
                  type="text"
                  placeholder="Promo code (e.g. ROYAL20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button type="submit" className="coupon-btn">
                  <FaTag /> Apply
                </button>
              </form>

              {appliedPromo && (
                <div style={{ color: "#16a34a", fontSize: "0.82rem", fontWeight: 700, marginBottom: "10px" }}>
                  ✓ Promo &apos;{appliedPromo.code}&apos; Applied! ({appliedPromo.discountPercent}% Discount)
                </div>
              )}
              {promoError && (
                <div style={{ color: "#e11d48", fontSize: "0.82rem", marginBottom: "10px" }}>
                  {promoError}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="price-breakdown-list">
                <div className="price-row">
                  <span>Suite Tariff ({nights} nights @ ₹{room.price.toLocaleString()})</span>
                  <span>₹{baseRoomTotal.toLocaleString()}</span>
                </div>

                {totalAddons > 0 && (
                  <div className="price-row">
                    <span>Curated Add-on Services</span>
                    <span>+₹{totalAddons.toLocaleString()}</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="price-row discount">
                    <span>Privilege Discount ({appliedPromo.discountPercent}%)</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="price-row">
                  <span>Luxury Hospitality GST (12%)</span>
                  <span>+₹{gstTax.toLocaleString()}</span>
                </div>

                <div className="price-row total">
                  <span>Total Payable</span>
                  <span style={{ color: "#0b111e" }}>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "0.78rem",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaShieldAlt style={{ color: "#10b981", fontSize: "1.2rem", flexShrink: 0 }} />
                <span>
                  Free cancellation until 48 hours prior to check-in. Zero hidden convenience fees.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}