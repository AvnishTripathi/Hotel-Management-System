function Navbar({ toggleSidebar }) {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <div
      style={{
        height: "70px",
        background: "#ffffff",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px"
      }}
    >
      <button
        onClick={toggleSidebar}
        style={{
          fontSize: "22px",
          cursor: "pointer"
        }}
      >
        ☰
      </button>

      <h3>Hotel Management System</h3>

      <div>
        Welcome, {user?.username}
      </div>
    </div>
  );
}

export default Navbar;