import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Users() {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingUser, setEditingUser] = useState(null);

  const [page, setPage] = useState(1);

  const rowsPerPage = 5;

  const [userForm, setUserForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    role: "RECEPTIONIST"
  });

  const getUsers = async () => {
    try {
      const response = await api.get("/users/");

      setUsers(response.data.data || []);

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to load users"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const saveUser = async () => {
    try {

      if (editingUser) {

        await api.put(
          `/users/${editingUser.user_id}`,
          userForm
        );

      } else {

        await api.post(
          "/users/",
          userForm
        );

      }

      setShowModal(false);

      getUsers();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Save Failed"
      );

    }
  };

  const deleteUser = async (id) => {

    if (
      !window.confirm(
        "Delete this user?"
      )
    ) {
      return;
    }

    try {

      await api.delete(
        `/users/${id}`
      );

      getUsers();

    } catch (error) {

      alert("Delete Failed");

    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (
        user.first_name +
        " " +
        user.last_name +
        " " +
        user.username +
        " " +
        user.email
      )
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  const start =
    (page - 1) * rowsPerPage;

  const paginatedUsers =
    filteredUsers.slice(
      start,
      start + rowsPerPage
    );

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
          marginLeft: isOpen
            ? "270px"
            : "20px",
          transition: "0.3s"
        }}
      >
        <h1>
          Users Management
        </h1>

        <input
          type="text"
          placeholder="Search User..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          style={{
            padding: "10px",
            width: "300px",
            marginBottom:
              "20px"
          }}
        />

        <br />
        <br />

        <button
          onClick={() => {
            setEditingUser(null);

            setUserForm({
              first_name: "",
              last_name: "",
              username: "",
              email: "",
              role:
                "RECEPTIONIST"
            });

            setShowModal(true);
          }}
          style={{
            padding: "10px 20px",
            marginBottom:
              "20px",
            background:
              "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "5px"
          }}
        >
          Add User
        </button>

        <div className="card">

          {loading ? (

            <p>
              Loading Users...
            </p>

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
                  <tr
                    style={{
                      background:
                        "#f1f5f9"
                    }}
                  >
                    <th>ID</th>
                    <th>
                      First Name
                    </th>
                    <th>
                      Last Name
                    </th>
                    <th>
                      Username
                    </th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {paginatedUsers.length >
                  0 ? (

                    paginatedUsers.map(
                      (user) => (
                        <tr
                          key={
                            user.user_id
                          }
                        >
                          <td>
                            {
                              user.user_id
                            }
                          </td>

                          <td>
                            {
                              user.first_name
                            }
                          </td>

                          <td>
                            {
                              user.last_name
                            }
                          </td>

                          <td>
                            {
                              user.username
                            }
                          </td>

                          <td>
                            {
                              user.email
                            }
                          </td>

                          <td>
                            {
                              user.role
                            }
                          </td>

                          <td>
                            <button
                              onClick={() => {

                                setEditingUser(
                                  user
                                );

                                setUserForm(
                                  {
                                    first_name:
                                      user.first_name,
                                    last_name:
                                      user.last_name,
                                    username:
                                      user.username,
                                    email:
                                      user.email,
                                    role:
                                      user.role
                                  }
                                );

                                setShowModal(
                                  true
                                );
                              }}
                            >
                              Edit
                            </button>

                            <button
                              style={{
                                marginLeft:
                                  "10px"
                              }}
                              onClick={() =>
                                deleteUser(
                                  user.user_id
                                )
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )
                    )

                  ) : (

                    <tr>
                      <td
                        colSpan="7"
                        style={{
                          textAlign:
                            "center"
                        }}
                      >
                        No Users
                        Found
                      </td>
                    </tr>

                  )}

                </tbody>
              </table>

              <br />

              <button
                disabled={
                  page === 1
                }
                onClick={() =>
                  setPage(
                    page - 1
                  )
                }
              >
                Previous
              </button>

              <span
                style={{
                  margin:
                    "0 15px"
                }}
              >
                Page {page}
              </span>

              <button
                disabled={
                  start +
                    rowsPerPage >=
                  filteredUsers.length
                }
                onClick={() =>
                  setPage(
                    page + 1
                  )
                }
              >
                Next
              </button>
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
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
                "white",
              padding: "20px",
              width: "400px",
              borderRadius:
                "10px"
            }}
          >
            <h2>
              {editingUser
                ? "Edit User"
                : "Add User"}
            </h2>

            <input
              placeholder="First Name"
              value={
                userForm.first_name
              }
              onChange={(e) =>
                setUserForm({
                  ...userForm,
                  first_name:
                    e.target.value
                })
              }
            />

            <br />
            <br />

            <input
              placeholder="Last Name"
              value={
                userForm.last_name
              }
              onChange={(e) =>
                setUserForm({
                  ...userForm,
                  last_name:
                    e.target.value
                })
              }
            />

            <br />
            <br />

            <input
              placeholder="Username"
              value={
                userForm.username
              }
              onChange={(e) =>
                setUserForm({
                  ...userForm,
                  username:
                    e.target.value
                })
              }
            />

            <br />
            <br />

            <input
              placeholder="Email"
              value={
                userForm.email
              }
              onChange={(e) =>
                setUserForm({
                  ...userForm,
                  email:
                    e.target.value
                })
              }
            />

            <br />
            <br />

            <select
              value={
                userForm.role
              }
              onChange={(e) =>
                setUserForm({
                  ...userForm,
                  role:
                    e.target.value
                })
              }
            >
              <option>
                SUPER_ADMIN
              </option>

              <option>
                MANAGER
              </option>

              <option>
                RECEPTIONIST
              </option>

               <option>
                CUSTOMER
              </option>
            </select>

            <br />
            <br />

            <button
              onClick={saveUser}
            >
              Save
            </button>

            <button
              style={{
                marginLeft:
                  "10px"
              }}
              onClick={() =>
                setShowModal(
                  false
                )
              }
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Users;

