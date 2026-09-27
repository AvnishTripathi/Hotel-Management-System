import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Rooms() {

  const [isOpen, setIsOpen] = useState(false);

  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingRoom, setEditingRoom] = useState(null);

  const [page, setPage] = useState(1);

  const rowsPerPage = 5;

  const [roomForm, setRoomForm] = useState({
    room_number: "",
    room_name: "",
    room_type: "STANDARD",
    room_status: "AVAILABLE",
    room_price: "",
    max_guests: "",
    floor_number: "",
    description: ""
  });

  const getRooms = async () => {

    try {

      const response = await api.get("/rooms/");

      setRooms(response.data.data || []);

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to load rooms"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    getRooms();

  }, []);

  const handleSave = async () => {

    try {

      if (editingRoom) {

        await api.put(
          `/rooms/${editingRoom.room_id}`,
          roomForm
        );

      } else {

        await api.post(
          "/rooms/",
          roomForm
        );

      }

      setShowModal(false);

      setEditingRoom(null);

      getRooms();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Save Failed"
      );

    }
  };

  const handleDelete = async (roomId) => {

    if (
      !window.confirm(
        "Delete this room?"
      )
    ) return;

    try {

      await api.delete(
        `/rooms/${roomId}`
      );

      getRooms();

    } catch {

      alert("Delete Failed");

    }
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.room_number
        ?.toString()
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      room.room_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      room.room_type
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  const startIndex =
    (page - 1) * rowsPerPage;

  const currentRooms =
    filteredRooms.slice(
      startIndex,
      startIndex + rowsPerPage
    );

  const getStatusColor = (status) => {

    switch (status) {

      case "AVAILABLE":
        return "green";

      case "OCCUPIED":
        return "red";

      case "RESERVED":
        return "orange";

      case "MAINTENANCE":
        return "gray";

      default:
        return "black";
    }
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={() =>
            setIsOpen(false)
          }
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
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
          marginLeft:
            isOpen ? "270px" : "20px",
          transition: "0.3s"
        }}
      >

        <h1>Rooms Management</h1>

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
            placeholder="Search Room..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            style={{
              padding: "10px",
              width: "300px"
            }}
          />

          <button
            onClick={() => {

              setEditingRoom(null);

              setRoomForm({
                room_number: "",
                room_name: "",
                room_type: "STANDARD",
                room_status:
                  "AVAILABLE",
                room_price: "",
                max_guests: "",
                floor_number: "",
                description: ""
              });

              setShowModal(true);

            }}
            style={{
              background:
                "#2563eb",
              color: "#fff",
              border: "none",
              padding:
                "10px 20px",
              borderRadius: "5px"
            }}
          >
            Add Room
          </button>

        </div>

        <div className="card">

          {loading ? (

            <p>Loading Rooms...</p>

          ) : (

            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse"
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      "#f1f5f9"
                  }}
                >
                  <th>ID</th>
                  <th>Room No</th>
                  <th>Room Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Guests</th>
                  <th>Floor</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {currentRooms.map(
                  (room) => (
                    <tr
                      key={
                        room.room_id
                      }
                    >
                      <td>
                        {
                          room.room_id
                        }
                      </td>

                      <td>
                        {
                          room.room_number
                        }
                      </td>

                      <td>
                        {
                          room.room_name
                        }
                      </td>

                      <td>
                        {
                          room.room_type
                        }
                      </td>

                      <td
                        style={{
                          color:
                            getStatusColor(
                              room.room_status
                            ),
                          fontWeight:
                            "bold"
                        }}
                      >
                        {
                          room.room_status
                        }
                      </td>

                      <td>
                        ₹
                        {
                          room.room_price
                        }
                      </td>

                      <td>
                        {
                          room.max_guests
                        }
                      </td>

                      <td>
                        {
                          room.floor_number
                        }
                      </td>

                      <td>

                        <button
                          onClick={() => {

                            setEditingRoom(
                              room
                            );

                            setRoomForm(
                              room
                            );

                            setShowModal(
                              true
                            );

                          }}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              room.room_id
                            )
                          }
                          style={{
                            marginLeft:
                              "10px"
                          }}
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

          <br />

          <button
            disabled={page === 1}
            onClick={() =>
              setPage(page - 1)
            }
          >
            Previous
          </button>

          <span
            style={{
              margin: "0 15px"
            }}
          >
            Page {page}
          </span>

          <button
            disabled={
              startIndex +
                rowsPerPage >=
              filteredRooms.length
            }
            onClick={() =>
              setPage(page + 1)
            }
          >
            Next
          </button>

        </div>

      </div>

      {showModal && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.5)",
            display: "flex",
            justifyContent:
              "center",
            alignItems:
              "center"
          }}
        >
          <div
            style={{
              background:
                "#fff",
              padding: "25px",
              width: "500px",
              borderRadius: "10px"
            }}
          >

            <h2>
              {editingRoom
                ? "Edit Room"
                : "Add Room"}
            </h2>

            <input
              placeholder="Room Number"
              value={
                roomForm.room_number
              }
              onChange={(e) =>
                setRoomForm({
                  ...roomForm,
                  room_number:
                    e.target.value
                })
              }
            />

            <br /><br />

            <input
              placeholder="Room Name"
              value={
                roomForm.room_name
              }
              onChange={(e) =>
                setRoomForm({
                  ...roomForm,
                  room_name:
                    e.target.value
                })
              }
            />

            <br /><br />

            <input
              placeholder="Room Type"
              value={
                roomForm.room_type
              }
              onChange={(e) =>
                setRoomForm({
                  ...roomForm,
                  room_type:
                    e.target.value
                })
              }
            />

            <br /><br />

            <input
              type="number"
              placeholder="Price"
              value={
                roomForm.room_price
              }
              onChange={(e) =>
                setRoomForm({
                  ...roomForm,
                  room_price:
                    e.target.value
                })
              }
            />

            <br /><br />

            <input
              type="number"
              placeholder="Max Guests"
              value={
                roomForm.max_guests
              }
              onChange={(e) =>
                setRoomForm({
                  ...roomForm,
                  max_guests:
                    e.target.value
                })
              }
            />

            <br /><br />

            <input
              type="number"
              placeholder="Floor Number"
              value={
                roomForm.floor_number
              }
              onChange={(e) =>
                setRoomForm({
                  ...roomForm,
                  floor_number:
                    e.target.value
                })
              }
            />

            <br /><br />

            <textarea
              placeholder="Description"
              value={
                roomForm.description
              }
              onChange={(e) =>
                setRoomForm({
                  ...roomForm,
                  description:
                    e.target.value
                })
              }
            />

            <br /><br />

            <select
              value={
                roomForm.room_status
              }
              onChange={(e) =>
                setRoomForm({
                  ...roomForm,
                  room_status:
                    e.target.value
                })
              }
            >
              <option>
                AVAILABLE
              </option>
              <option>
                OCCUPIED
              </option>
              <option>
                RESERVED
              </option>
              <option>
                MAINTENANCE
              </option>
              <option>
                CLEANING
              </option>
            </select>

            <br /><br />

            <button
              onClick={handleSave}
            >
              Save
            </button>

            <button
              onClick={() =>
                setShowModal(false)
              }
              style={{
                marginLeft:
                  "10px"
              }}
            >
              Cancel
            </button>

          </div>
        </div>

      )}
    </>
  );
}

export default Rooms;