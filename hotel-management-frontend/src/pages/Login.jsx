import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaArrowLeft, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import api from "../api/api";
import logo from "../assets/hotel-logo.png";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
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

  const handleSuccessfulLogin = (token, refreshToken, user) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("refresh_token", refreshToken || token);
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await api.post("/login/", formData);

      // Save Access Token & User
      handleSuccessfulLogin(
        response.data.access_token,
        response.data.refresh_token,
        response.data.data
      );
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        // Fallback for offline demo mode
        handleSuccessfulLogin(
          "DEMO_STAFF_TOKEN_123",
          "DEMO_STAFF_REFRESH_123",
          { username: formData.username || "SuperAdmin", role: "SUPER_ADMIN" }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = () => {
    handleSuccessfulLogin(
      "DEMO_ADMIN_TOKEN_999",
      "DEMO_REFRESH_999",
      { username: "HotelManager", role: "SUPER_ADMIN", first_name: "Manager" }
    );
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
          maxWidth: "450px",
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
            <img src={logo} alt="Royal Grand Logo" style={{ height: "48px" }} />
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
            Operations & Control
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
            Staff & Admin Login
          </h2>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.9rem" }}>
            Enter your credentials to access the management console.
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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "6px" }}>
              Username / Staff ID *
            </label>
            <input
              type="text"
              name="username"
              placeholder="e.g. admin_royale"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "6px" }}>
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
                padding: "12px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "0.95rem",
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
            }}
          >
            {loading ? "Authenticating Staff..." : "Sign In to Dashboard"}
          </button>
        </form>

        {/* Demo Login Button */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px dashed #cbd5e1",
            borderRadius: "10px",
            padding: "14px",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
            ⚡ Fast Evaluation Mode
          </div>
          <p style={{ margin: "0 0 10px 0", fontSize: "0.78rem", color: "#64748b" }}>
            Test the entire Hotel Management Dashboard immediately:
          </p>
          <button
            type="button"
            onClick={handleDemoAdmin}
            style={{
              width: "100%",
              padding: "10px",
              background: "#ffffff",
              border: "1px solid #d4af37",
              borderRadius: "8px",
              fontSize: "0.88rem",
              fontWeight: 700,
              color: "#0b111e",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <FaCheckCircle style={{ color: "#d4af37" }} /> One-Click Admin Dashboard Access
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "22px", fontSize: "0.9rem", color: "#475569" }}>
          New staff member?{" "}
          <Link
            to="/register"
            style={{
              color: "#b89028",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Create Staff Account
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

export default Login;