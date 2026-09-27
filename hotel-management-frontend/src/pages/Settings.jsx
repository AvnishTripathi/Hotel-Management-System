import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Settings() {
  const [isOpen, setIsOpen] = useState(false);

  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormData = {
    hotel_name: "",
    hotel_code: "",
    hotel_email: "",
    hotel_phone: "",
    hotel_address: "",
    hotel_website: "",
    hotel_logo: "",
    currency: "INR",
    tax_percentage: 0,
    service_charge_percentage: 0,
    payment_methods: "",
    smtp_host: "",
    smtp_port: "",
    smtp_email: "",
    smtp_password: "",
    sms_provider: "",
    sms_api_key: "",
    timezone: "Asia/Kolkata",
    date_format: "DD-MM-YYYY",
    language: "English",
    maintenance_mode: "NO"
  };

  const [formData, setFormData] =
    useState(initialFormData);

  const getSettings = async () => {
    try {
      const response = await api.get("/settings/");

      setSettings(response.data.data || []);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to load settings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSettings();
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

  const openEditModal = (setting) => {
    setEditingId(setting.setting_id);

    setFormData({
      hotel_name: setting.hotel_name || "",
      hotel_code: setting.hotel_code || "",
      hotel_email: setting.hotel_email || "",
      hotel_phone: setting.hotel_phone || "",
      hotel_address: setting.hotel_address || "",
      hotel_website: setting.hotel_website || "",
      hotel_logo: setting.hotel_logo || "",
      currency: setting.currency || "INR",
      tax_percentage:
        setting.tax_percentage || 0,
      service_charge_percentage:
        setting.service_charge_percentage || 0,
      payment_methods:
        setting.payment_methods || "",
      smtp_host: setting.smtp_host || "",
      smtp_port: setting.smtp_port || "",
      smtp_email: setting.smtp_email || "",
      smtp_password:
        setting.smtp_password || "",
      sms_provider:
        setting.sms_provider || "",
      sms_api_key:
        setting.sms_api_key || "",
      timezone:
        setting.timezone || "Asia/Kolkata",
      date_format:
        setting.date_format || "DD-MM-YYYY",
      language:
        setting.language || "English",
      maintenance_mode:
        setting.maintenance_mode || "NO"
    });

    setShowModal(true);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    ...formData,

    smtp_port: formData.smtp_port
      ? parseInt(formData.smtp_port, 10)
      : null,

    tax_percentage: formData.tax_percentage
      ? parseFloat(formData.tax_percentage)
      : 0,

    service_charge_percentage:
      formData.service_charge_percentage
        ? parseFloat(formData.service_charge_percentage)
        : 0
  };

  try {
    if (editingId) {
      await api.put(`/settings/${editingId}`, payload);
      alert("Settings updated successfully");
    } else {
      await api.post("/settings/", payload);
      alert("Settings created successfully");
    }

    setShowModal(false);
    getSettings();

  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Operation failed"
    );
  }
};

  const deleteSetting = async (settingId) => {
    if (
      !window.confirm(
        "Delete this setting?"
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/settings/${settingId}`
      );

      alert(
        "Settings deleted successfully"
      );

      getSettings();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
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
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "20px"
          }}
        >
          <h1>Settings</h1>

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
            Add Settings
          </button>
        </div>

        <div className="card">
          {loading ? (
            <p>Loading settings...</p>
          ) : (
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
                  <th>Hotel Name</th>
                  <th>Hotel Code</th>
                  <th>Currency</th>
                  <th>Timezone</th>
                  <th>Language</th>
                  <th>Maintenance</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {settings.map((setting) => (
                  <tr
                    key={setting.setting_id}
                  >
                    <td>
                      {setting.setting_id}
                    </td>

                    <td>
                      {setting.hotel_name}
                    </td>

                    <td>
                      {setting.hotel_code}
                    </td>

                    <td>
                      {setting.currency}
                    </td>

                    <td>
                      {setting.timezone}
                    </td>

                    <td>
                      {setting.language}
                    </td>

                    <td>
                      {
                        setting.maintenance_mode
                      }
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          openEditModal(
                            setting
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
                          deleteSetting(
                            setting.setting_id
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
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
            width: "700px",
            maxWidth: "95%",
            maxHeight: "80vh",
            overflowY: "auto",
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            zIndex: 1000
          }}
        >
          <h2>
            {editingId
              ? "Edit Settings"
              : "Add Settings"}
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="hotel_name"
              placeholder="Hotel Name"
              value={formData.hotel_name}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="text"
              name="hotel_code"
              placeholder="Hotel Code"
              value={formData.hotel_code}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="email"
              name="hotel_email"
              placeholder="Hotel Email"
              value={formData.hotel_email}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="text"
              name="hotel_phone"
              placeholder="Hotel Phone"
              value={formData.hotel_phone}
              onChange={handleChange}
              style={inputStyle}
            />

            <textarea
              name="hotel_address"
              placeholder="Hotel Address"
              value={formData.hotel_address}
              onChange={handleChange}
              rows="3"
              style={inputStyle}
            />

            <input
              type="text"
              name="hotel_website"
              placeholder="Hotel Website"
              value={formData.hotel_website}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="text"
              name="hotel_logo"
              placeholder="Hotel Logo URL"
              value={formData.hotel_logo}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="text"
              name="currency"
              placeholder="Currency"
              value={formData.currency}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="tax_percentage"
              placeholder="Tax Percentage"
              value={formData.tax_percentage}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="service_charge_percentage"
              placeholder="Service Charge Percentage"
              value={
                formData.service_charge_percentage
              }
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="text"
              name="payment_methods"
              placeholder="Payment Methods"
              value={formData.payment_methods}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="text"
              name="smtp_host"
              placeholder="SMTP Host"
              value={formData.smtp_host}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="smtp_port"
              placeholder="SMTP Port"
              value={formData.smtp_port}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="email"
              name="smtp_email"
              placeholder="SMTP Email"
              value={formData.smtp_email}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="password"
              name="smtp_password"
              placeholder="SMTP Password"
              value={formData.smtp_password}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="text"
              name="sms_provider"
              placeholder="SMS Provider"
              value={formData.sms_provider}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="text"
              name="sms_api_key"
              placeholder="SMS API Key"
              value={formData.sms_api_key}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="text"
              name="timezone"
              placeholder="Timezone"
              value={formData.timezone}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="text"
              name="date_format"
              placeholder="Date Format"
              value={formData.date_format}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="text"
              name="language"
              placeholder="Language"
              value={formData.language}
              onChange={handleChange}
              style={inputStyle}
            />

            <select
              name="maintenance_mode"
              value={
                formData.maintenance_mode
              }
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="NO">NO</option>
              <option value="YES">YES</option>
            </select>

            <div
              style={{
                marginTop: "20px"
              }}
            >
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
                  : "Save"}
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
            </div>
          </form>
        </div>
      )}
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "5px",
  boxSizing: "border-box"
};

export default Settings;