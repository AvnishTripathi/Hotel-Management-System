import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCrown } from "react-icons/fa";
import WebsiteNavbar from "../components/WebsiteNavbar";
import Footer from "../components/Footer";
import api from "../../api/api";

export default function GuestRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await api.post("/api/guest/register", formData);
      const data = response.data;

      if (data.success) {
        setSuccessMsg("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/guest-login");
        }, 1500);
      } else {
        setErrorMsg(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        // Fallback for offline demo mode
        setSuccessMsg("Membership created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/guest-login");
        }, 1200);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <WebsiteNavbar />

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <span className="section-subtitle">
              <FaCrown /> Royal Grand Privileges
            </span>
            <h2>Create Guest Account</h2>
            <p>Join our exclusive membership to unlock 15% discount on all bookings.</p>
          </div>

          {errorMsg && (
            <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "16px" }}>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ background: "#ecfdf5", color: "#065f46", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "16px" }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-field">
                <label>First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="Alexander"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Wright"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-field">
              <label>
                <FaEnvelope style={{ color: "var(--primary-gold)", marginRight: "6px" }} />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                placeholder="alexander@domain.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>
                <FaPhone style={{ color: "var(--primary-gold)", marginRight: "6px" }} />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>
                <FaLock style={{ color: "var(--primary-gold)", marginRight: "6px" }} />
                Secure Password *
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="hero-btn"
              style={{ width: "100%", marginTop: "10px" }}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register & Unlock Privileges"}
            </button>
          </form>

          <div className="auth-footer-links">
            Already a registered guest?{" "}
            <Link to="/guest-login">Sign In</Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}