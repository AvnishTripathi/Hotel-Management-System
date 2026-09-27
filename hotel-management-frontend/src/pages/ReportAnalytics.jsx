import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function ReportAnalytics() {
  const [isOpen, setIsOpen] = useState(false);

  const [reportType, setReportType] = useState("occupancy");
  const [reportData, setReportData] = useState(null);

  const [loading, setLoading] = useState(false);

  const getReport = async (type) => {
    try {
      setLoading(true);

      const response = await api.get(
        `/reports?report_type=${type}`
      );

      setReportData(response.data);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to load report"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReport(reportType);
  }, [reportType]);

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
        toggleSidebar={() => setIsOpen(!isOpen)}
      />

      <div
        style={{
          padding: "30px",
          marginLeft: isOpen ? "270px" : "20px",
          transition: "0.3s"
        }}
      >
        <h1>Reports & Analytics</h1>

        <div
          style={{
            marginBottom: "20px"
          }}
        >
          <select
            value={reportType}
            onChange={(e) =>
              setReportType(e.target.value)
            }
            style={{
              padding: "10px",
              width: "250px",
              borderRadius: "5px"
            }}
          >
            <option value="occupancy">
              Occupancy Report
            </option>

            <option value="booking">
              Booking Report
            </option>

            <option value="revenue">
              Revenue Report
            </option>

            <option value="guest">
              Guest Report
            </option>
          </select>
        </div>

        <div
          className="card"
          style={{
            padding: "20px"
          }}
        >
          {loading ? (
            <p>Loading report...</p>
          ) : !reportData ? (
            <p>No data available</p>
          ) : (
            <>
              <h2>{reportData.report}</h2>

              {/* Occupancy Report */}
              {reportType === "occupancy" && (
                <div>
                  <p>
                    <strong>Total Rooms:</strong>{" "}
                    {reportData.data?.total_rooms || 0}
                  </p>

                  <p>
                    <strong>Occupied Rooms:</strong>{" "}
                    {reportData.data?.occupied_rooms || 0}
                  </p>

                  <p>
                    <strong>Available Rooms:</strong>{" "}
                    {reportData.data?.available_rooms || 0}
                  </p>

                  <p>
                    <strong>Occupancy Rate:</strong>{" "}
                    {reportData.occupancy_rate || 0}%
                  </p>
                </div>
              )}

              {/* Booking Report */}
              {reportType === "booking" && (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse"
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px"
                        }}
                      >
                        Status
                      </th>

                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px"
                        }}
                      >
                        Total Bookings
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {reportData.data?.map(
                      (item, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "10px"
                            }}
                          >
                            {item.booking_status}
                          </td>

                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "10px"
                            }}
                          >
                            {item.total_bookings}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}

              {/* Revenue Report */}
              {reportType === "revenue" && (
                <div>
                  <p>
                    <strong>Total Payments:</strong>{" "}
                    {reportData.data?.total_payments || 0}
                  </p>

                  <p>
                    <strong>Total Revenue:</strong> ₹
                    {reportData.data?.total_revenue || 0}
                  </p>

                  <p>
                    <strong>Collected Revenue:</strong>{" "}
                    ₹
                    {reportData.data?.collected_revenue ||
                      0}
                  </p>
                </div>
              )}

              {/* Guest Report */}
              {reportType === "guest" && (
                <>
                  <p>
                    <strong>Total Guests:</strong>{" "}
                    {reportData.summary?.total_guests ||
                      0}
                  </p>

                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      marginTop: "20px"
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "10px"
                          }}
                        >
                          Nationality
                        </th>

                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "10px"
                          }}
                        >
                          Count
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {reportData.nationality_data?.map(
                        (item, index) => (
                          <tr key={index}>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "10px"
                              }}
                            >
                              {item.nationality}
                            </td>

                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "10px"
                              }}
                            >
                              {item.total}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ReportAnalytics;