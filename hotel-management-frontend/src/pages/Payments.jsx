import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Payments() {
  const [isOpen, setIsOpen] = useState(false);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10;

  const initialFormData = {
    stay_id: "",
    invoice_number: "",
    room_charge: 0,
    food_charge: 0,
    laundry_charge: 0,
    service_charge: 0,
    other_charge: 0,
    discount_amount: 0,
    tax_amount: 0,
    paid_amount: 0,
    payment_method: "CASH",
    payment_status: "PENDING",
    remarks: ""
  };

  const [formData, setFormData] = useState(initialFormData);

  const getPayments = async () => {
    try {
      setLoading(true);

      const response = await api.get("/payments/");

      setPayments(response.data.data || []);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to load payments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPayments();
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

  const openEditModal = (payment) => {
    setEditingId(payment.payment_id);

    setFormData({
      stay_id: payment.stay_id || "",
      invoice_number: payment.invoice_number || "",
      room_charge: payment.room_charge || 0,
      food_charge: payment.food_charge || 0,
      laundry_charge: payment.laundry_charge || 0,
      service_charge: payment.service_charge || 0,
      other_charge: payment.other_charge || 0,
      discount_amount: payment.discount_amount || 0,
      tax_amount: payment.tax_amount || 0,
      paid_amount: payment.paid_amount || 0,
      payment_method: payment.payment_method || "CASH",
      payment_status: payment.payment_status || "PENDING",
      remarks: payment.remarks || ""
    });

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/payments/${editingId}`, {
          paid_amount: formData.paid_amount,
          payment_method: formData.payment_method,
          payment_status: formData.payment_status,
          remarks: formData.remarks
        });

        alert("Payment updated successfully");
      } else {
        await api.post("/payments/", formData);

        alert("Payment created successfully");
      }

      setShowModal(false);
      getPayments();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Operation failed"
      );
    }
  };

  const refundPayment = async (paymentId) => {
    if (
      !window.confirm(
        "Refund this payment?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/payments/${paymentId}`);

      alert(
        "Payment refunded successfully"
      );

      getPayments();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Refund failed"
      );
    }
  };

  const filteredPayments = payments.filter(
    (payment) =>
      String(payment.invoice_number || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(payment.stay_id || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const indexOfLastPayment =
    currentPage * paymentsPerPage;

  const indexOfFirstPayment =
    indexOfLastPayment - paymentsPerPage;

  const currentPayments =
    filteredPayments.slice(
      indexOfFirstPayment,
      indexOfLastPayment
    );

  const totalPages = Math.ceil(
    filteredPayments.length / paymentsPerPage
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
        <h1>Payments Management</h1>

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
            placeholder="Search invoice..."
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
            Add Payment
          </button>
        </div>

        <div className="card">
          {loading ? (
            <p>Loading payments...</p>
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
                    <th>Invoice</th>
                    <th>Stay ID</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {currentPayments.map(
                    (payment) => (
                      <tr
                        key={
                          payment.payment_id
                        }
                      >
                        <td>
                          {payment.payment_id}
                        </td>

                        <td>
                          {
                            payment.invoice_number
                          }
                        </td>

                        <td>
                          {payment.stay_id}
                        </td>

                        <td>
                          ₹
                          {payment.total_amount}
                        </td>

                        <td>
                          ₹
                          {payment.paid_amount}
                        </td>

                        <td>
                          ₹
                          {
                            payment.balance_amount
                          }
                        </td>

                        <td>
                          {
                            payment.payment_method
                          }
                        </td>

                        <td>
                          {
                            payment.payment_status
                          }
                        </td>

                        <td>
                          {formatDateTime(
                            payment.payment_date
                          )}
                        </td>

                        <td>
                          <button
                            onClick={() =>
                              openEditModal(
                                payment
                              )
                            }
                            style={{
                              marginRight:
                                "10px"
                            }}
                          >
                            Edit
                          </button>

                          {payment.payment_status !==
                            "REFUNDED" && (
                            <button
                              onClick={() =>
                                refundPayment(
                                  payment.payment_id
                                )
                              }
                            >
                              Refund
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
                ? "Update Payment"
                : "Create Payment"}
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
                      name="stay_id"
                      placeholder="Stay ID"
                      value={
                        formData.stay_id
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                    <input
                      type="text"
                      name="invoice_number"
                      placeholder="Invoice Number"
                      value={
                        formData.invoice_number
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                    <input
                      type="number"
                      step="0.01"
                      name="room_charge"
                      placeholder="Room Charge"
                      value={
                        formData.room_charge
                      }
                      onChange={
                        handleChange
                      }
                    />

                    <input
                      type="number"
                      step="0.01"
                      name="food_charge"
                      placeholder="Food Charge"
                      value={
                        formData.food_charge
                      }
                      onChange={
                        handleChange
                      }
                    />

                    <input
                      type="number"
                      step="0.01"
                      name="laundry_charge"
                      placeholder="Laundry Charge"
                      value={
                        formData.laundry_charge
                      }
                      onChange={
                        handleChange
                      }
                    />

                    <input
                      type="number"
                      step="0.01"
                      name="service_charge"
                      placeholder="Service Charge"
                      value={
                        formData.service_charge
                      }
                      onChange={
                        handleChange
                      }
                    />

                    <input
                      type="number"
                      step="0.01"
                      name="other_charge"
                      placeholder="Other Charge"
                      value={
                        formData.other_charge
                      }
                      onChange={
                        handleChange
                      }
                    />

                    <input
                      type="number"
                      step="0.01"
                      name="discount_amount"
                      placeholder="Discount"
                      value={
                        formData.discount_amount
                      }
                      onChange={
                        handleChange
                      }
                    />

                    <input
                      type="number"
                      step="0.01"
                      name="tax_amount"
                      placeholder="Tax"
                      value={
                        formData.tax_amount
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </>
                )}

                <input
                  type="number"
                  step="0.01"
                  name="paid_amount"
                  placeholder="Paid Amount"
                  value={
                    formData.paid_amount
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <select
                  name="payment_method"
                  value={
                    formData.payment_method
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="CASH">
                    Cash
                  </option>
                  <option value="CARD">
                    Card
                  </option>
                  <option value="UPI">
                    UPI
                  </option>
                  <option value="BANK_TRANSFER">
                    Bank Transfer
                  </option>
                </select>

                <select
                  name="payment_status"
                  value={
                    formData.payment_status
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="PENDING">
                    Pending
                  </option>
                  <option value="PAID">
                    Paid
                  </option>
                  <option value="PARTIAL">
                    Partial
                  </option>
                </select>
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
                    ? "Update Payment"
                    : "Create Payment"}
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

export default Payments;