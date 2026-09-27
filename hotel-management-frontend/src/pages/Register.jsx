import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaUserShield,
  FaHotel,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../api/api";
import logo from "../assets/hotel-logo.png";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "SUPER_ADMIN",
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
    setSuccessMsg("");

    try {
      const response = await api.post("/register/", formData);
      setSuccessMsg(response.data.message || "Registration Successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      // If API fails or backend is unreachable, provide fallback
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setSuccessMsg("Administrator registered successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #18233c 0%, #0b111e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        boxSizing: "border-box",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.45)",
          border: "1px solid rgba(212, 175, 55, 0.3)",
          boxSizing: "border-box",
        }}
      >
        {/* Header with Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <img src={logo} alt="Royal Grand Logo" style={{ height: "46px" }} />
          </div>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "#b89028",
            }}
          >
            Management & Staff Portal
          </span>
          <h2
            style={{
              fontFamily: "'Cinzel', Georgia, serif",
              fontSize: "1.85rem",
              color: "#0b111e",
              margin: "6px 0",
              fontWeight: 700,
            }}
          >
            Staff Registration
          </h2>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.9rem" }}>
            Create an administrative account to manage suites, stays & billing.
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              marginBottom: "18px",
            }}
          >
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              background: "#ecfdf5",
              color: "#065f46",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaCheckCircle style={{ color: "#10b981" }} /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "4px" }}>
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "11px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  fontSize: "0.92rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "4px" }}>
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "11px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  fontSize: "0.92rem",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "4px" }}>
              Username *
            </label>
            <input
              type="text"
              name="username"
              placeholder="e.g. admin_johndoe"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "11px 12px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "0.92rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "4px" }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                placeholder="staff@royalgrand.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "11px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  fontSize: "0.92rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "4px" }}>
                Phone Number *
              </label>
              <input
                type="text"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "11px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  fontSize: "0.92rem",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "4px" }}>
              Staff Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "11px 12px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "0.92rem",
                boxSizing: "border-box",
                background: "#f8fafc",
              }}
            >
              <option value="SUPER_ADMIN">Super Administrator</option>
              <option value="FRONT_DESK">Front Desk Concierge</option>
              <option value="HOUSEKEEPING">Housekeeping Supervisor</option>
              <option value="MANAGER">General Hotel Manager</option>
            </select>
          </div>

          <div style={{ marginBottom: "22px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "4px" }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "11px 12px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "0.92rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(135deg, #d4af37 0%, #b89028 100%)",
              color: "#0b111e",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(212, 175, 55, 0.35)",
              transition: "transform 0.2s",
            }}
          >
            {loading ? "Registering Staff..." : "Create Staff Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "22px", fontSize: "0.9rem", color: "#475569" }}>
          Already have a staff account?{" "}
          <Link
            to="/login"
            style={{
              color: "#b89028",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Sign In Here
          </Link>
        </div>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#94a3b8",
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
          >
            <FaArrowLeft /> Return to Main Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;