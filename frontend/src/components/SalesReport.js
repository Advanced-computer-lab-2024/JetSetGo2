import React, { useState } from "react";
import axios from "axios";
import { Card, Button, Spinner, Alert, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const SalesReportPage = () => {
  const [salesReport, setSalesReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    productName: "",
    specificDate: "",
    specificMonth: "",
  });

  const fetchSalesReport = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:8000/SalesReport/generate",
        null,
        { params: filters }
      );
      setSalesReport(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch sales report");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    amount.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-4">
      <h2>Sales Report</h2>

      {/* Filters */}
      <Form className="mb-4">
        <Form.Group controlId="productName">
          <Form.Label>Filter by Product Name</Form.Label>
          <Form.Control
            type="text"
            name="productName"
            value={filters.productName}
            onChange={handleFilterChange}
            placeholder="Enter product name"
          />
        </Form.Group>

        <Form.Group controlId="specificDate">
          <Form.Label>Filter by Specific Date</Form.Label>
          <Form.Control
            type="date"
            name="specificDate"
            value={filters.specificDate}
            onChange={handleFilterChange}
          />
        </Form.Group>

        <Form.Group controlId="specificMonth">
          <Form.Label>Filter by Specific Month</Form.Label>
          <Form.Control
            type="month"
            name="specificMonth"
            value={filters.specificMonth}
            onChange={handleFilterChange}
          />
        </Form.Group>
      </Form>

      {/* Fetch Button */}
      <div className="mb-3">
        <Button onClick={fetchSalesReport} variant="primary" disabled={loading}>
          {loading ? "Generating..." : "Generate Sales Report"}
        </Button>
      </div>

      {/* Error Alert */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Report Card */}
      {salesReport && (
        <Card>
          <Card.Header>
            <h5>Sales Report</h5>
          </Card.Header>
          <Card.Body>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Revenue Source</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Activity Revenue</td>
                  <td>{formatCurrency(salesReport.activityRevenue)}</td>
                </tr>
                <tr>
                  <td>Itinerary Revenue</td>
                  <td>{formatCurrency(salesReport.itineraryRevenue)}</td>
                </tr>
                <tr>
                  <td>Gift Shop Revenue</td>
                  <td>{formatCurrency(salesReport.giftShopRevenue)}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Total Revenue</strong>
                  </td>
                  <td>
                    <strong>{formatCurrency(salesReport.totalRevenue)}</strong>
                  </td>
                </tr>
                <tr>
                  <td>App Fee (10%)</td>
                  <td>{formatCurrency(salesReport.appFee)}</td>
                </tr>
              </tbody>
            </table>
          </Card.Body>
        </Card>
      )}

      {/* Loading Spinner */}
      {loading && <Spinner animation="border" role="status" className="mt-3" />}
    </div>
  );
};

export default SalesReportPage;
