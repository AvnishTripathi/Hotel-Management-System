import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Stays() {
  const [isOpen, setIsOpen] = useState(false);

  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const staysPerPage = 10;

  const initialFormData = {
    guest_id: "",
    booking_id: "",
    room_id: "",
    remarks: ""
  };

  const [formData, setFormData] = useState(initialFormData);

  const getStays = async () => {
    try {
      setLoading(true);

      const response = await api.get("/stays/");

      setStays(response.data.data || []);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to load stays"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStays();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openCheckInModal = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const openRemarksModal = (stay) => {
    setEditingId(stay.stay_id);

    setFormData({
      guest_id: stay.guest_id || "",
      booking_id: stay.booking_id || "",
      room_id: stay.room_id || "",
      remarks: stay.remarks || ""
    });

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(
          `/stays/${editingId}`,
          {
            remarks: formData.remarks
          }
        );

        alert("Stay updated successfully");
      } else {
        await api.post("/stays/", {
          guest_id: formData.guest_id,
          booking_id: formData.booking_id,
          room_id: formData.room_id
        });

        alert("Guest checked in successfully");
      }

      setShowModal(false);
      getStays();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Operation failed"
      );
    }
  };

  const checkOutGuest = async (stayId) => {
    if (
      !window.confirm(
        "Check out this guest?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/stays/${stayId}`);

      alert(
        "Guest checked out successfully"
      );

      getStays();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Check-out failed"
      );
    }
  };

  const filteredStays = stays.filter(
    (stay) =>
      String(stay.stay_id)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(stay.guest_id)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(stay.room_id)
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const indexOfLastStay =
    currentPage * staysPerPage;

  const indexOfFirstStay =
    indexOfLastStay - staysPerPage;

  const currentStays =
    filteredStays.slice(
      indexOfFirstStay,
      indexOfLastStay
    );

  const totalPages = Math.ceil(
    filteredStays.length / staysPerPage
  );

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short"
      }
    );
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.3)",
            zIndex: 998
          }}
        />
      )}

      <Sidebar isOpen={isOpen} />

      <Navbar
        toggleSidebar={() =>
          setIsOpen(!isOpen)
        }
      />

      <div
        style={{
          padding: "30px",
          marginLeft: isOpen
            ? "270px"
            : "20px",
          transition: "0.3s"
        }}
      >
        <h1>Stay Management</h1>

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            marginBottom: "20px"
          }}
        >
          <input
            type="text"
            placeholder="Search stay..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: "10px",
              width: "300px",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
          />

          <button
            onClick={openCheckInModal}
            style={{
              padding: "10px 20px",
              background: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Check In Guest
          </button>
        </div>

        <div className="card">
          {loading ? (
            <p>Loading stays...</p>
          ) : (
            <>
              <table
                style={{
                  width: "100%",
                  borderCollapse:
                    "collapse"
                }}
              >
                <thead>
                  <tr>
                    <th>Stay ID</th>
                    <th>Guest ID</th>
                    <th>Booking ID</th>
                    <th>Room ID</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {currentStays.map(
                    (stay) => (
                      <tr key={stay.stay_id}>
                        <td>{stay.stay_id}</td>

                        <td>{stay.guest_id}</td>

                        <td>{stay.booking_id}</td>

                        <td>{stay.room_id}</td>

                        <td>
                          {formatDateTime(
                            stay.actual_checkin
                          )}
                        </td>

                        <td>
                          {formatDateTime(
                            stay.check_out_time
                          )}
                        </td>

                        <td>
                          {stay.stay_status}
                        </td>

                        <td>
                          <button
                            onClick={() =>
                              openRemarksModal(
                                stay
                              )
                            }
                            style={{
                              marginRight:
                                "10px"
                            }}
                          >
                            Remarks
                          </button>

                          {stay.stay_status ===
                            "CHECKED_IN" && (
                            <button
                              onClick={() =>
                                checkOutGuest(
                                  stay.stay_id
                                )
                              }
                            >
                              Check Out
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent:
                    "center",
                  alignItems: "center",
                  gap: "15px"
                }}
              >
                <button
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      currentPage - 1
                    )
                  }
                >
                  Previous
                </button>

                <span>
                  Page {currentPage} of{" "}
                  {totalPages || 1}
                </span>

                <button
                  disabled={
                    currentPage ===
                      totalPages ||
                    totalPages === 0
                  }
                  onClick={() =>
                    setCurrentPage(
                      currentPage + 1
                    )
                  }
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "600px",
              maxWidth: "95%",
              maxHeight: "80vh",
              overflowY: "auto",
              borderRadius: "12px",
              padding: "25px"
            }}
          >
            <h2>
              {editingId
                ? "Update Remarks"
                : "Guest Check In"}
            </h2>

            <form
              onSubmit={handleSubmit}
            >
              {editingId ? (
                <textarea
                  name="remarks"
                  placeholder="Remarks"
                  rows="5"
                  value={formData.remarks}
                  onChange={handleChange}
                  style={{
                    width: "100%"
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: "15px"
                  }}
                >
                  <input
                    type="number"
                    name="guest_id"
                    placeholder="Guest ID"
                    value={
                      formData.guest_id
                    }
                    onChange={handleChange}
                    required
                  />

                  <input
                    type="number"
                    name="booking_id"
                    placeholder="Booking ID"
                    value={
                      formData.booking_id
                    }
                    onChange={handleChange}
                    required
                  />

                  <input
                    type="number"
                    name="room_id"
                    placeholder="Room ID"
                    value={
                      formData.room_id
                    }
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  gap: "10px"
                }}
              >
                <button
                  type="submit"
                  style={{
                    background: "#16a34a",
                    color: "#fff",
                    border: "none",
                    padding:
                      "10px 20px",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  {editingId
                    ? "Update"
                    : "Check In"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  style={{
                    background: "#dc2626",
                    color: "#fff",
                    border: "none",
                    padding:
                      "10px 20px",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Stays;