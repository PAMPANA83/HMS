import { Button as BootstrapButton, Card, Col, Form, Row } from "react-bootstrap";
import DataTable, { type TableColumn } from "react-data-table-component";
import { message, Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import { BillingMastersDto } from "../models/Billing.dto";
import {
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { getbilling } from "../services/Billing.service";
import { BillingModal } from "./BillingModal"; // Import your modal component

export function Billing() {
  const [data, setData] = useState<BillingMastersDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  
  // Modal states
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<BillingMastersDto | null>(null);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const response = await getbilling();
      setData(response || []);
    } catch {
      message.error("Failed to fetch billing data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const handleOpenCreate = () => {
    setSelectedRecord(null);
    setIsModalVisible(true);
  };

  const handleOpenEdit = (record: BillingMastersDto) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.billNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.patientName?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.doctorName?.toLowerCase().includes(searchText.toLowerCase());

      return matchesSearch;
    });
  }, [data, searchText]);

  const columns: TableColumn<BillingMastersDto>[] = [
    {
      name: "Bill Number",
      selector: (row) => row.billNumber || "-",
      sortable: true,
    },
    {
      name: "Patient Name",
      selector: (row) => row.patientName || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Doctor Name",
      selector: (row) => row.doctorName || "-",
      sortable: true,
      hide: 768,
    },
    {
      name: "Total Amount",
      selector: (row) => row.totalAmount || 0,
      sortable: true,
      right: true,
      cell: (row) => `₹ ${(row.totalAmount || 0).toFixed(2)}`,
    },
    {
      name: "Paid Amount",
      selector: (row) => row.paidAmount || 0,
      sortable: true,
      right: true,
      cell: (row) => `₹ ${(row.paidAmount || 0).toFixed(2)}`,
    },
    {
      name: "Payment Status",
      selector: (row) => row.paymentStatus || "N/A",
      sortable: true,
      cell: (row) => {
        const status = row.paymentStatus?.toLowerCase();
        const color = status === "paid" ? "success" : status === "pending" ? "warning" : "secondary";
        return <span className={`badge text-bg-${color}`}>{row.paymentStatus?.toUpperCase() || "N/A"}</span>;
      },
    },
    {
      name: "Payment Method",
      selector: (row) => row.paymentMethod || "-",
      sortable: true,
      hide: 768,
    },
    {
      name: "Actions",
      button: true,
      cell: (record) => (
        <div className="d-flex justify-content-center">
          <Tooltip title="View / Edit">
            <BootstrapButton
              variant="outline-primary"
              size="sm"
              aria-label="Edit billing record"
              onClick={() => handleOpenEdit(record)}
            >
              <EditOutlined />
            </BootstrapButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="billing-page p-2 p-md-4 bg-light min-vh-100">
      <Card className="border-0 shadow-sm rounded-4 mx-auto" style={{ maxWidth: 1500 }}>
        <Card.Body className="p-2 p-md-4">
        <Row className="align-items-center justify-content-between g-3 mb-3">
          <Col xs={12} lg="auto">
            <h3 className="mb-0 fw-bold">Billing Management</h3>
          </Col>
          <Col xs={12} lg="auto">
            <div className="d-flex flex-wrap gap-2">
              <BootstrapButton
                variant="outline-secondary"
                onClick={fetchBillingData}
              >
                <ReloadOutlined className="me-2" />
                Refresh
              </BootstrapButton>
              <BootstrapButton variant="primary" onClick={handleOpenCreate}>
                Create Bill
              </BootstrapButton>
            </div>
          </Col>
        </Row>

        <Row className="g-3 mb-3">
          <Col xs={12} sm={8} md={6}>
            <Form.Control
              placeholder="Search by bill, patient, or doctor..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
        </Row>

        <DataTable
          className="billing-data-table"
          columns={columns}
          data={filteredData}
          keyField="id"
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 50]}
          progressPending={loading}
          persistTableHead
          highlightOnHover
          responsive
          noDataComponent={<div className="py-4 text-muted">No billing records found</div>}
          customStyles={{
            headCells: { style: { fontWeight: 600, backgroundColor: "#f8fafc" } },
            rows: { style: { minHeight: "56px" } },
          }}
        />
        </Card.Body>
      </Card>

      <BillingModal
        visible={isModalVisible}
        initialData={selectedRecord}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          fetchBillingData();
        }}
      />
    </div>
  );
}

export default Billing;