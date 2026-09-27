import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Bookings() {
  const [isOpen, setIsOpen] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormData = {
    room_id: "",
    guest_name: "",
    guest_email: "",
    guest_phone: "",
    check_in_date: "",
    check_out_date: "",
    total_guests: 1,
    total_amount: "",
    special_request: ""
  };

  const [formData, setFormData] = useState(initialFormData);

  const getBookings = async () => {
    try {
      setLoading(true);

      const response = await api.get("/bookings/");

      setBookings(response.data.data || []);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to load bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const openEditModal = (booking) => {
    setEditingId(booking.booking_id);

    setFormData({
      room_id: booking.room_id || "",
      guest_name: booking.guest_name || "",
      guest_email: booking.guest_email || "",
      guest_phone: booking.guest_phone || "",

      check_in_date: booking.check_in_date
        ? new Date(booking.check_in_date)
            .toISOString()
            .split("T")[0]
        : "",

      check_out_date: booking.check_out_date
        ? new Date(booking.check_out_date)
            .toISOString()
            .split("T")[0]
        : "",

      total_guests: booking.total_guests || 1,
      total_amount: booking.total_amount || "",
      special_request: booking.special_request || ""
    });

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(
          `/bookings/${editingId}`,
          formData
        );

        alert("Booking updated successfully");
      } else {
        await api.post(
          "/bookings/",
          formData
        );

        alert("Booking created successfully");
      }

      setShowModal(false);
      getBookings();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Operation failed"
      );
    }
  };

  const deleteBooking = async (bookingId) => {
    if (
      !window.confirm(
        "Cancel this booking?"
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/bookings/${bookingId}`
      );

      alert(
        "Booking cancelled successfully"
      );

      getBookings();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Cancel failed"
      );
    }
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.guest_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      booking.booking_reference
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  const indexOfLastBooking =
    currentPage * bookingsPerPage;

  const indexOfFirstBooking =
    indexOfLastBooking - bookingsPerPage;

  const currentBookings =
    filteredBookings.slice(
      indexOfFirstBooking,
      indexOfLastBooking
    );

  const totalPages = Math.ceil(
    filteredBookings.length /
      bookingsPerPage
  );

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
        <h1>Bookings Management</h1>

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
            placeholder="Search booking..."
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
            onClick={openAddModal}
            style={{
              padding: "10px 20px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Add Booking
          </button>
        </div>

        <div className="card">
          {loading ? (
            <p>Loading bookings...</p>
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
                    <th>Reference</th>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {currentBookings.map(
                    (booking) => (
                      <tr
                        key={
                          booking.booking_id
                        }
                      >
                        <td>
                          {
                            booking.booking_reference
                          }
                        </td>

                        <td>
                          {
                            booking.guest_name
                          }
                        </td>

                        <td>
                          {booking.room_id}
                        </td>

                        <td>
                          {
                            booking.check_in_date
                          }
                        </td>

                        <td>
                          {
                            booking.check_out_date
                          }
                        </td>

                        <td>
                          {
                            booking.booking_status
                          }
                        </td>

                        <td>
                          ₹
                          {
                            booking.total_amount
                          }
                        </td>

                        <td>
                          <button
                            onClick={() =>
                              openEditModal(
                                booking
                              )
                            }
                            style={{
                              marginRight:
                                "10px"
                            }}
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteBooking(
                                booking.booking_id
                              )
                            }
                          >
                            Cancel
                          </button>
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
              width: "800px",
              maxWidth: "95%",
              maxHeight: "80vh",
              overflowY: "auto",
              borderRadius: "12px",
              padding: "25px"
            }}
          >
            <h2>
              {editingId
                ? "Edit Booking"
                : "Add Booking"}
            </h2>

            <form
              onSubmit={handleSubmit}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "15px"
                }}
              >
                <input
                  type="number"
                  name="room_id"
                  placeholder="Room ID"
                  value={formData.room_id}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="guest_name"
                  placeholder="Guest Name"
                  value={
                    formData.guest_name
                  }
                  onChange={handleChange}
                  required
                />

                <input
                  type="email"
                  name="guest_email"
                  placeholder="Guest Email"
                  value={
                    formData.guest_email
                  }
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="guest_phone"
                  placeholder="Guest Phone"
                  value={
                    formData.guest_phone
                  }
                  onChange={handleChange}
                  required
                />

                <input
                  type="date"
                  name="check_in_date"
                  value={
                    formData.check_in_date
                  }
                  onChange={handleChange}
                  required
                />

                <input
                  type="date"
                  name="check_out_date"
                  value={
                    formData.check_out_date
                  }
                  onChange={handleChange}
                  required
                />

                <input
                  type="number"
                  name="total_guests"
                  placeholder="Total Guests"
                  value={
                    formData.total_guests
                  }
                  onChange={handleChange}
                  required
                />

                <input
                  type="number"
                  step="0.01"
                  name="total_amount"
                  placeholder="Total Amount"
                  value={
                    formData.total_amount
                  }
                  onChange={handleChange}
                  required
                />
              </div>

              <textarea
                name="special_request"
                placeholder="Special Request"
                rows="4"
                value={
                  formData.special_request
                }
                onChange={handleChange}
                style={{
                  width: "100%",
                  marginTop: "15px"
                }}
              />

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
                    ? "Update Booking"
                    : "Create Booking"}
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

export default Bookings;