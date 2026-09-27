import { Link } from "react-router-dom";
import hotelLogo from "../assets/hotel-logo.png";

function Sidebar({ isOpen }) {
  if (!isOpen) return null;

  const linkStyle = {
    color: "#ffffff",
    textDecoration: "none",
    display: "block",
    padding: "12px 15px",
    borderRadius: "6px",
    transition: "background 0.2s ease"
  };

  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        background: "#1f2937",
        color: "#fff",
        position: "fixed",
        left: 0,
        top: 0,
        padding: "20px",
        zIndex: 999,
        overflowY: "auto"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px"
        }}
      >
        <img
          src={hotelLogo}
          alt="Royal Grand Hotel"
          style={{
            width: "45px",
            height: "45px",
            objectFit: "contain",
            borderRadius: "8px"
          }}
        />

        <h2
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "700"
          }}
        >
          Royal Grand Hotel
        </h2>
      </div>

      <hr
        style={{
          border: "1px solid rgba(255,255,255,0.1)",
          marginBottom: "15px"
        }}
      />

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0
        }}
      >
        <li><Link style={linkStyle} to="/dashboard">Dashboard</Link></li>
        <li><Link style={linkStyle} to="/users">Users</Link></li>
        <li><Link style={linkStyle} to="/rooms">Rooms</Link></li>
        <li><Link style={linkStyle} to="/bookings">Bookings</Link></li>
        <li><Link style={linkStyle} to="/guests">Guests</Link></li>
        <li><Link style={linkStyle} to="/stays">Stays</Link></li>
        <li><Link style={linkStyle} to="/payments">Payments</Link></li>
        <li><Link style={linkStyle} to="/housekeeping">Housekeeping</Link></li>
        <li><Link style={linkStyle} to="/reports">Reports & Analytics</Link></li>
        <li><Link style={linkStyle} to="/notifications">Notifications</Link></li>
        <li><Link style={linkStyle} to="/settings">Settings</Link></li>

        <li style={{ marginTop: "20px" }}>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            style={{
              width: "100%",
              padding: "12px",
              background: "#dc2626",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;