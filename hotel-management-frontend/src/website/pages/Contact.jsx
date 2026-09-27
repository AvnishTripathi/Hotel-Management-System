import { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaChevronDown,
  FaPaperPlane,
  FaCheckCircle,
  FaWhatsapp,
} from "react-icons/fa";
import WebsiteNavbar from "../components/WebsiteNavbar";
import Footer from "../components/Footer";
import { hotelInfo, faqsData } from "../data/hotelData";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "Reservation Inquiry",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiryType: "Reservation Inquiry",
        subject: "",
        message: "",
      });
    }, 4000);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <WebsiteNavbar />

      <div className="page-hero">
        <span className="hero-badge">24/7 Dedicated Assistance</span>
        <h1>Contact & Concierge Desk</h1>
        <p>
          We are delighted to assist you with bespoke bookings, private banquet inquiries, and VIP transfer arrangements.
        </p>
      </div>

      <section style={{ padding: "80px 5%" }}>
        <div className="contact-layout">
          {/* Left Column: Direct Coordinates */}
          <div className="contact-info-cards">
            <div className="info-card">
              <div className="info-icon">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h4>Palace Address</h4>
                <p>{hotelInfo.address}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FaPhoneAlt />
              </div>
              <div>
                <h4>Direct Reservations Hotline</h4>
                <p>
                  <strong>Main:</strong> {hotelInfo.phone}
                </p>
                <p>
                  <strong>Concierge:</strong> {hotelInfo.altPhone}
                </p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FaEnvelope />
              </div>
              <div>
                <h4>Email Inquiries</h4>
                <p>
                  <strong>General:</strong> {hotelInfo.email}
                </p>
                <p>
                  <strong>VIP Concierge:</strong> {hotelInfo.conciergeEmail}
                </p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FaClock />
              </div>
              <div>
                <h4>Front Desk & Timings</h4>
                <p>24 Hours Front Desk & Security</p>
                <p>
                  Check-in: {hotelInfo.checkInTime} | Check-out: {hotelInfo.checkOutTime}
                </p>
              </div>
            </div>

            <div
              style={{
                background: "#0b111e",
                borderRadius: "14px",
                padding: "24px",
                color: "white",
                border: "1px solid var(--primary-gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 4px 0", color: "var(--primary-gold)" }}>Instant WhatsApp Concierge</h4>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
                  Chat directly with our guest relations team
                </p>
              </div>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                style={{
                  background: "#25D366",
                  color: "white",
                  padding: "10px 18px",
                  borderRadius: "30px",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FaWhatsapp /> Chat Now
              </a>
            </div>
          </div>

          {/* Right Column: Contact & Booking Form */}
          <div className="contact-form-container">
            <h2>Send Us a Message</h2>
            <p>Our concierge team will respond within 2 hours.</p>

            {submitted ? (
              <div
                style={{
                  background: "#ecfdf5",
                  border: "1px solid #10b981",
                  color: "#065f46",
                  padding: "24px",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <FaCheckCircle style={{ fontSize: "2.5rem", color: "#10b981", marginBottom: "12px" }} />
                <h3 style={{ margin: "0 0 6px 0" }}>Inquiry Transmitted Successfully</h3>
                <p style={{ margin: 0, fontSize: "0.95rem" }}>
                  Thank you for reaching out, {formData.name}. Our Head of Guest Relations will contact you promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Lord Alexander Wright"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="alexander@domain.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 00000"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>Inquiry Nature</label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                    >
                      <option value="Reservation Inquiry">Suite Reservation Inquiry</option>
                      <option value="Wedding & Banquet">Royal Wedding & Banquet</option>
                      <option value="VIP Concierge">VIP Concierge & Butler</option>
                      <option value="Corporate Retreat">Executive Corporate Retreat</option>
                      <option value="Private Dining">Private Sky Dining</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Brief summary of your request"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Detailed Message *</label>
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Please specify any preferred dates, suite preferences, or special accommodations..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="hero-btn"
                  style={{ width: "100%", marginTop: "10px" }}
                >
                  <FaPaperPlane /> Send Message to Concierge
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="faq-section">
          <div className="section-header">
            <span className="section-subtitle">Got Questions?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-desc">
              Everything you need to know about reserving and staying at Royal Grand.
            </p>
          </div>

          <div>
            {faqsData.map((faq, index) => (
              <div className="faq-item" key={index}>
                <button
                  className={`faq-question ${openFaq === index ? "open" : ""}`}
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>
                  <FaChevronDown />
                </button>
                {openFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}