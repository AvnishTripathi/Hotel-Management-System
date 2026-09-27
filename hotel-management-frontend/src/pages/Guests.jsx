import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Guests() {
  const [isOpen, setIsOpen] = useState(false);

  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const guestsPerPage = 10;

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

 const [formData, setFormData] = useState({
  first_name: "",
  last_name: "",
  gender: "",
  date_of_birth: "",
  email: "",
  phone: "",
  nationality: "",
  id_type: "",
  id_number: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postal_code: ""
});

  const getGuests = async () => {
    try {
      const response = await api.get("/guests/");
      setGuests(response.data.data || []);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to load guests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGuests();
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
    first_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    email: "",
    phone: "",
    nationality: "",
    id_type: "",
    id_number: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: ""
  });

  setShowModal(true);
};

const openEditModal = (guest) => {
  setEditingId(guest.guest_id);

  setFormData({
    first_name: guest.first_name || "",
    last_name: guest.last_name || "",
    gender: guest.gender || "",
   date_of_birth: guest.date_of_birth
  ? new Date(guest.date_of_birth)
      .toISOString()
      .split("T")[0]
  : "",
    email: guest.email || "",
    phone: guest.phone || "",
    nationality: guest.nationality || "",
    id_type: guest.id_type || "",
    id_number: guest.id_number || "",
    address: guest.address || "",
    city: guest.city || "",
    state: guest.state || "",
    country: guest.country || "",
    postal_code: guest.postal_code || ""
  });

  setShowModal(true);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(
          `/guests/${editingId}`,
          formData
        );

        alert("Guest updated successfully");
      } else {
        await api.post(
          "/guests/",
          formData
        );

        alert("Guest added successfully");
      }

      setShowModal(false);

      getGuests();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Operation Failed"
      );
    }
  };

  const deleteGuest = async (guestId) => {

    if (
      !window.confirm(
        "Delete this guest?"
      )
    ) {
      return;
    }

    try {

      await api.delete(
        `/guests/${guestId}`
      );

      alert(
        "Guest deleted successfully"
      );

      getGuests();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Delete Failed"
      );

    }
  };

  const filteredGuests = guests.filter(
    (guest) =>
      `${guest.first_name || ""} ${guest.last_name || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const indexOfLastGuest = currentPage * guestsPerPage;
const indexOfFirstGuest = indexOfLastGuest - guestsPerPage;

const currentGuests = filteredGuests.slice(
  indexOfFirstGuest,
  indexOfLastGuest
);

const totalPages = Math.ceil(
  filteredGuests.length / guestsPerPage
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
        <h1>Guests Management</h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px"
          }}
        >
          <input
            type="text"
            placeholder="Search Guest..."
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
              borderRadius: "5px"
            }}
          >
            Add Guest
          </button>
        </div>

       <div className="card">

  {loading ? (

    <p>Loading Guests...</p>

  ) : (

    <>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Nationality</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentGuests.map((guest) => (
            <tr key={guest.guest_id}>
              <td>{guest.guest_id}</td>

              <td>{guest.guest_code}</td>

              <td>
                {guest.first_name} {guest.last_name}
              </td>

              <td>{guest.phone}</td>

              <td>{guest.email}</td>

              <td>{guest.nationality}</td>

              <td>
                <button
                  onClick={() => openEditModal(guest)}
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteGuest(guest.guest_id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "15px"
        }}
      >
        <button
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(currentPage - 1)
          }
          style={{
            padding: "8px 15px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor:
              currentPage === 1
                ? "not-allowed"
                : "pointer"
          }}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          disabled={
            currentPage === totalPages ||
            totalPages === 0
          }
          onClick={() =>
            setCurrentPage(currentPage + 1)
          }
          style={{
            padding: "8px 15px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor:
              currentPage === totalPages ||
              totalPages === 0
                ? "not-allowed"
                : "pointer"
          }}
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
            top: "50%",
            left: "50%",
            transform:
              "translate(-50%, -50%)",
            background: "#fff",
            padding: "20px",
            width: "500px",
            borderRadius: "10px",
            zIndex: 1000
          }}
        >

          <h2>
            {editingId
              ? "Edit Guest"
              : "Add Guest"}
          </h2>

          <form
            onSubmit={
              handleSubmit
            }
          >

           <input
  type="text"
  name="first_name"
  placeholder="First Name"
  value={formData.first_name}
  onChange={handleChange}
  className="form-input"
/>

<input
  type="text"
  name="last_name"
  placeholder="Last Name"
  value={formData.last_name}
  onChange={handleChange}
  className="form-input"
/>

<select
  name="gender"
  value={formData.gender}
  onChange={handleChange}
  className="form-select"
>
  <option value="">Select Gender</option>
  <option value="MALE">Male</option>
  <option value="FEMALE">Female</option>
  <option value="OTHER">Other</option>
</select>

<input
  type="date"
  name="date_of_birth"
  value={formData.date_of_birth}
  onChange={handleChange}
  className="form-input"
/>

<textarea
  name="address"
  placeholder="Address"
  rows="3"
  value={formData.address}
  onChange={handleChange}
  className="form-textarea"
/>

<button type="submit" className="btn-save">
  {editingId ? "Update Guest" : "Add Guest"}
</button>

<button
  type="button"
  onClick={() => setShowModal(false)}
  className="btn-cancel"
>
  Cancel
</button>


          </form>

        </div>

      )}

    </>
  );
}

export default Guests;

