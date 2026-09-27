import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "0.3s"
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.3)",
            zIndex: 998
          }}
        />
      )}

      <Sidebar isOpen={isOpen} />

      <Navbar
        toggleSidebar={() => setIsOpen(!isOpen)}
      />

      <div
        style={{
          padding: "30px",
          marginLeft: isOpen ? "270px" : "20px",
          transition: "0.3s"
        }}
      >
        <h1>Dashboard</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px"
          }}
        >
          <div
            style={cardStyle}
            onClick={() => navigate("/rooms")}
          >
            <h2>120</h2>
            <p>Total Rooms</p>
          </div>

          <div
            style={cardStyle}
            onClick={() => navigate("/guests")}
          >
            <h2>85</h2>
            <p>Total Guests</p>
          </div>

          <div
            style={cardStyle}
            onClick={() => navigate("/bookings")}
          >
            <h2>40</h2>
            <p>Total Bookings</p>
          </div>

          <div
            style={cardStyle}
            onClick={() => navigate("/payments")}
          >
            <h2>₹75,000</h2>
            <p>Total Revenue</p>
          </div>

          <div
            style={cardStyle}
            onClick={() => navigate("/stays")}
          >
            <h2>Check-In / Check-Out</h2>
            <p>Manage Guest Stays</p>
          </div>

          <div
            style={cardStyle}
            onClick={() => navigate("/housekeeping")}
          >
            <h2>Housekeeping</h2>
            <p>Manage Cleaning Tasks</p>
          </div>

          <div
            style={cardStyle}
            onClick={() => navigate("/reports")}
          >
            <h2>Reports & Analytics</h2>
            <p>View Occupancy, Revenue & Guest Reports</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;