import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Notifications() {
  const [isOpen, setIsOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    guest_id: "",
    booking_id: "",
    notification_type: "EMAIL",
    recipient_name: "",
    recipient_email: "",
    recipient_phone: "",
    subject: "",
    message: "",
    status: "SENT",
    error_message: ""
  });

  const getNotifications = async () => {
    try {
      const response = await api.get("/notifications/");
      setNotifications(response.data.data || []);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openAddModal = () => {
    setEditingId(null);

    setFormData({
      guest_id: "",
      booking_id: "",
      notification_type: "EMAIL",
      recipient_name: "",
      recipient_email: "",
      recipient_phone: "",
      subject: "",
      message: "",
      status: "SENT",
      error_message: ""
    });

    setShowModal(true);
  };

  const openEditModal = (notification) => {
    setEditingId(notification.notification_id);

    setFormData({
      guest_id: notification.guest_id || "",
      booking_id: notification.booking_id || "",
      notification_type:
        notification.notification_type || "EMAIL",
      recipient_name:
        notification.recipient_name || "",
      recipient_email:
        notification.recipient_email || "",
      recipient_phone:
        notification.recipient_phone || "",
      subject: notification.subject || "",
      message: notification.message || "",
      status: notification.status || "SENT",
      error_message:
        notification.error_message || ""
    });

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(
          `/notifications/${editingId}`,
          {
            status: formData.status,
            error_message: formData.error_message
          }
        );

        alert("Notification updated successfully");
      } else {
        await api.post("/notifications/", {
          guest_id: formData.guest_id || null,
          booking_id: formData.booking_id || null,
          notification_type: formData.notification_type,
          recipient_name: formData.recipient_name,
          recipient_email: formData.recipient_email,
          recipient_phone: formData.recipient_phone,
          subject: formData.subject,
          message: formData.message
        });

        alert("Notification created successfully");
      }

      setShowModal(false);
      getNotifications();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Operation failed"
      );
    }
  };

  const deleteNotification = async (
    notificationId
  ) => {
    if (
      !window.confirm(
        "Delete this notification?"
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/notifications/${notificationId}`
      );

      alert(
        "Notification deleted successfully"
      );

      getNotifications();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  const filteredNotifications =
    notifications.filter((notification) =>
      `${notification.subject || ""} ${
        notification.recipient_name || ""
      }`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

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
        toggleSidebar={() =>
          setIsOpen(!isOpen)
        }
      />

      <div
        style={{
          padding: "30px",
          marginLeft: isOpen ? "270px" : "20px",
          transition: "0.3s"
        }}
      >
        <h1>Notifications</h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px"
          }}
        >
          <input
            type="text"
            placeholder="Search notification..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              padding: "10px",
              width: "300px"
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
            Create Notification
          </button>
        </div>

        <div className="card">
          {loading ? (
            <p>Loading notifications...</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse"
              }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Recipient</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Sent At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredNotifications.map(
                  (notification) => (
                    <tr
                      key={
                        notification.notification_id
                      }
                    >
                      <td>
                        {
                          notification.notification_id
                        }
                      </td>

                      <td>
                        {
                          notification.notification_type
                        }
                      </td>

                      <td>
                        {
                          notification.recipient_name
                        }
                      </td>

                      <td>
                        {notification.subject}
                      </td>

                      <td>
                        {notification.status}
                      </td>

                      <td>
                        {notification.sent_at
                          ? new Date(
                              notification.sent_at
                            ).toLocaleString(
                              "en-IN",
                              {
                                timeZone:
                                  "Asia/Kolkata"
                              }
                            )
                          : "-"}
                      </td>

                      <td>
                        <button
                          onClick={() =>
                            openEditModal(
                              notification
                            )
                          }
                          style={{
                            marginRight: "10px"
                          }}
                        >
                          Update
                        </button>

                        <button
                          onClick={() =>
                            deleteNotification(
                              notification.notification_id
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform:
              "translate(-50%, -50%)",
            background: "#fff",
            padding: "20px",
            width: "500px",
            maxHeight: "80vh",
            overflowY: "auto",
            borderRadius: "10px",
            zIndex: 1000
          }}
        >
          <h2>
            {editingId
              ? "Update Notification"
              : "Create Notification"}
          </h2>

          <form onSubmit={handleSubmit}>
            {!editingId && (
              <>
                <input
                  type="number"
                  name="guest_id"
                  placeholder="Guest ID"
                  value={formData.guest_id}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px"
                  }}
                />

                <input
                  type="number"
                  name="booking_id"
                  placeholder="Booking ID"
                  value={formData.booking_id}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px"
                  }}
                />

                <select
                  name="notification_type"
                  value={
                    formData.notification_type
                  }
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px"
                  }}
                >
                  <option value="EMAIL">
                    EMAIL
                  </option>
                  <option value="SMS">
                    SMS
                  </option>
                  <option value="WHATSAPP">
                    WHATSAPP
                  </option>
                </select>

                <input
                  type="text"
                  name="recipient_name"
                  placeholder="Recipient Name"
                  value={
                    formData.recipient_name
                  }
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px"
                  }}
                />

                <input
                  type="email"
                  name="recipient_email"
                  placeholder="Recipient Email"
                  value={
                    formData.recipient_email
                  }
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px"
                  }}
                />

                <input
                  type="text"
                  name="recipient_phone"
                  placeholder="Recipient Phone"
                  value={
                    formData.recipient_phone
                  }
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px"
                  }}
                />

                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px"
                  }}
                />

                <textarea
                  name="message"
                  placeholder="Message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px"
                  }}
                />
              </>
            )}

            {editingId && (
              <>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px"
                  }}
                >
                  <option value="SENT">
                    SENT
                  </option>

                  <option value="FAILED">
                    FAILED
                  </option>

                  <option value="DELIVERED">
                    DELIVERED
                  </option>
                </select>

                <textarea
                  name="error_message"
                  placeholder="Error Message"
                  rows="3"
                  value={
                    formData.error_message
                  }
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px"
                  }}
                />
              </>
            )}

            <button
              type="submit"
              style={{
                padding: "10px 20px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                marginRight: "10px"
              }}
            >
              {editingId
                ? "Update"
                : "Create"}
            </button>

            <button
              type="button"
              onClick={() =>
                setShowModal(false)
              }
              style={{
                padding: "10px 20px"
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Notifications;