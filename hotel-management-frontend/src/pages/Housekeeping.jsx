import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Housekeeping() {
  const [isOpen, setIsOpen] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  const initialFormData = {
    room_id: "",
    assigned_to: "",
    task_type: "",
    task_description: "",
    cleaning_status: "PENDING",
    lost_item_name: "",
    lost_item_location: "",
    maintenance_issue: "",
    priority_level: "LOW",
    remarks: ""
  };

  const [formData, setFormData] = useState(initialFormData);

  const getTasks = async () => {
    try {
      setLoading(true);

      const response = await api.get("/housekeeping/");

      setTasks(response.data.data || []);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to load tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
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

  const openEditModal = (task) => {
    setEditingId(task.housekeeping_id);

    setFormData({
      room_id: task.room_id || "",
      assigned_to: task.assigned_to || "",
      task_type: task.task_type || "",
      task_description: task.task_description || "",
      cleaning_status: task.cleaning_status || "PENDING",
      lost_item_name: task.lost_item_name || "",
      lost_item_location: task.lost_item_location || "",
      maintenance_issue: task.maintenance_issue || "",
      priority_level: task.priority_level || "LOW",
      remarks: task.remarks || ""
    });

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(
          `/housekeeping/${editingId}`,
          {
            assigned_to: formData.assigned_to,
            cleaning_status: formData.cleaning_status,
            priority_level: formData.priority_level,
            remarks: formData.remarks
          }
        );

        alert("Task updated successfully");
      } else {
        await api.post(
          "/housekeeping/",
          formData
        );

        alert("Task created successfully");
      }

      setShowModal(false);
      getTasks();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Operation failed"
      );
    }
  };

  const deleteTask = async (taskId) => {
    if (
      !window.confirm(
        "Delete this task?"
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/housekeeping/${taskId}`
      );

      alert("Task deleted successfully");

      getTasks();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      String(task.room_id || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(task.assigned_to || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(task.task_type || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const indexOfLastTask =
    currentPage * tasksPerPage;

  const indexOfFirstTask =
    indexOfLastTask - tasksPerPage;

  const currentTasks =
    filteredTasks.slice(
      indexOfFirstTask,
      indexOfLastTask
    );

  const totalPages = Math.ceil(
    filteredTasks.length / tasksPerPage
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
          marginLeft: isOpen
            ? "270px"
            : "20px",
          transition: "0.3s"
        }}
      >
        <h1>Housekeeping Management</h1>

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
            placeholder="Search task..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
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
            Add Task
          </button>
        </div>

        <div className="card">
          {loading ? (
            <p>Loading tasks...</p>
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
                    <th>ID</th>
                    <th>Room ID</th>
                    <th>Assigned To</th>
                    <th>Task Type</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Completed</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {currentTasks.map(
                    (task) => (
                      <tr
                        key={
                          task.housekeeping_id
                        }
                      >
                        <td>
                          {
                            task.housekeeping_id
                          }
                        </td>

                        <td>{task.room_id}</td>

                        <td>
                          {task.assigned_to}
                        </td>

                        <td>
                          {task.task_type}
                        </td>

                        <td>
                          {
                            task.cleaning_status
                          }
                        </td>

                        <td>
                          {
                            task.priority_level
                          }
                        </td>

                        <td>
                          {formatDateTime(
                            task.completed_date
                          )}
                        </td>

                        <td>
                          <button
                            onClick={() =>
                              openEditModal(
                                task
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
                              deleteTask(
                                task.housekeeping_id
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
            background: "rgba(0,0,0,0.5)",
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
              width: "700px",
              maxWidth: "95%",
              maxHeight: "80vh",
              overflowY: "auto",
              borderRadius: "10px",
              padding: "20px"
            }}
          >
            <h2>
              {editingId
                ? "Update Task"
                : "Create Task"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "15px"
                }}
              >
                {!editingId && (
                  <>
                    <input
                      type="number"
                      name="room_id"
                      placeholder="Room ID"
                      value={
                        formData.room_id
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                    <input
                      type="text"
                      name="assigned_to"
                      placeholder="Assigned To"
                      value={
                        formData.assigned_to
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                    <select
                      name="task_type"
                      value={
                        formData.task_type
                      }
                      onChange={
                        handleChange
                      }
                      required
                    >
                      <option value="">
                        Select Task Type
                      </option>
                      <option value="CLEANING">
                        Cleaning
                      </option>
                      <option value="MAINTENANCE">
                        Maintenance
                      </option>
                      <option value="LOST_FOUND">
                        Lost & Found
                      </option>
                    </select>

                    <select
                      name="priority_level"
                      value={
                        formData.priority_level
                      }
                      onChange={
                        handleChange
                      }
                    >
                      <option value="LOW">
                        Low
                      </option>
                      <option value="MEDIUM">
                        Medium
                      </option>
                      <option value="HIGH">
                        High
                      </option>
                    </select>

                    <textarea
                      name="task_description"
                      placeholder="Task Description"
                      value={
                        formData.task_description
                      }
                      onChange={
                        handleChange
                      }
                    />

                    <input
                      type="text"
                      name="lost_item_name"
                      placeholder="Lost Item Name"
                      value={
                        formData.lost_item_name
                      }
                      onChange={
                        handleChange
                      }
                    />

                    <input
                      type="text"
                      name="lost_item_location"
                      placeholder="Lost Item Location"
                      value={
                        formData.lost_item_location
                      }
                      onChange={
                        handleChange
                      }
                    />

                    <input
                      type="text"
                      name="maintenance_issue"
                      placeholder="Maintenance Issue"
                      value={
                        formData.maintenance_issue
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </>
                )}

                {editingId && (
                  <>
                    <input
                      type="text"
                      name="assigned_to"
                      placeholder="Assigned To"
                      value={
                        formData.assigned_to
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                    <select
                      name="cleaning_status"
                      value={
                        formData.cleaning_status
                      }
                      onChange={
                        handleChange
                      }
                    >
                      <option value="PENDING">
                        Pending
                      </option>
                      <option value="IN_PROGRESS">
                        In Progress
                      </option>
                      <option value="COMPLETED">
                        Completed
                      </option>
                    </select>

                    <select
                      name="priority_level"
                      value={
                        formData.priority_level
                      }
                      onChange={
                        handleChange
                      }
                    >
                      <option value="LOW">
                        Low
                      </option>
                      <option value="MEDIUM">
                        Medium
                      </option>
                      <option value="HIGH">
                        High
                      </option>
                    </select>
                  </>
                )}
              </div>

              <textarea
                name="remarks"
                placeholder="Remarks"
                rows="4"
                value={formData.remarks}
                onChange={handleChange}
                style={{
                  width: "100%",
                  marginTop: "15px"
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px"
                }}
              >
                <button type="submit">
                  {editingId
                    ? "Update Task"
                    : "Create Task"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
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

export default Housekeeping;