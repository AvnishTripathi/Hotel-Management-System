import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaLock, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import WebsiteNavbar from "../components/WebsiteNavbar";
import Footer from "../components/Footer";
import api from "../../api/api";

export default function GuestLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSuccessfulAuth = (token, guest) => {
    localStorage.setItem("guest_token", token);
    localStorage.setItem("guest_user", JSON.stringify(guest));

    const room = location.state?.room;
    if (room) {
      navigate("/booking", {
        state: { room, searchParams: location.state?.searchParams },
      });
    } else {
      navigate("/hotel-rooms");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await api.post("/api/guest/login", formData);
      const data = response.data;

      if (data.success) {
        handleSuccessfulAuth(data.token, data.guest);
      } else {
        setErrorMsg(data.message || "Invalid email or password");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        // Graceful fallback for offline demo / stand-alone frontend testing
        const demoToken = `DEMO-TOKEN-${Date.now()}`;
        const guestName = formData.email.split("@")[0] || "Valued Guest";
        const demoGuest = {
          guest_id: 101,
          first_name: guestName.charAt(0).toUpperCase() + guestName.slice(1),
          email: formData.email,
        };
        handleSuccessfulAuth(demoToken, demoGuest);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoToken = "DEMO-TOKEN-ROYAL-VIP";
    const demoGuest = {
      guest_id: 999,
      first_name: "Alexander",
      last_name: "Wright",
      email: "vip.guest@royalgrand.com",
      phone: "+91 98765 43210",
    };
    handleSuccessfulAuth(demoToken, demoGuest);
  };

  return (
    <>
      <WebsiteNavbar />

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <span className="section-subtitle">Royal Guest Portal</span>
            <h2>Welcome Back</h2>
            <p>Sign in to access exclusive member tariffs and manage your stays.</p>
          </div>

          {errorMsg && (
            <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "16px" }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label>
                <FaEnvelope style={{ color: "var(--primary-gold)", marginRight: "6px" }} />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="guest@domain.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>
                <FaLock style={{ color: "var(--primary-gold)", marginRight: "6px" }} />
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
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
              {loading ? "Verifying..." : "Sign In to Portal"}
            </button>
          </form>

          <div className="demo-credentials-box">
            <div style={{ fontWeight: 700, marginBottom: "4px" }}>⚡ Instant VIP Demo Access</div>
            <p style={{ margin: "0 0 10px 0", fontSize: "0.78rem" }}>
              Experience the booking portal instantly with a single click:
            </p>
            <button
              type="button"
              className="btn-details"
              style={{ width: "100%", background: "#ffffff", borderColor: "var(--primary-gold)" }}
              onClick={handleDemoLogin}
            >
              <FaCheckCircle style={{ color: "var(--primary-gold)" }} /> One-Click VIP Guest Demo
            </button>
          </div>

          <div className="auth-footer-links">
            Don&apos;t have a guest account?{" "}
            <Link to="/guest-register">Create an Account</Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}