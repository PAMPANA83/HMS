import React, { useState, useEffect } from "react";
import { Card, Button, Form, Badge, Row, Col, Spinner } from "react-bootstrap";
import DataTable, { type TableColumn } from "react-data-table-component";
import { SearchOutlined, ReloadOutlined, PlusOutlined, FilterOutlined, EditOutlined, DeleteOutlined, MedicineBoxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { DoctorDto } from "../models/Doctor.dto";
import { getDoctors, deleteDoctor } from "../services/Doctor.service";

const notify = (text: string) => window.alert(text);

export const Doctor: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DoctorDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string | undefined>(undefined);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string | undefined>(undefined);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<boolean | undefined>(undefined);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await getDoctors();
      const doctorList = Array.isArray(response) ? response : response?.data || [];
      setData(doctorList);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      notify("Failed to load doctor records.");
    } finally {
      // Fixed syntax typo 'fontinally' -> 'finally'
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Dynamic dropdown options for custom filter toolbar
  const branchOptions = Array.from(new Set(data.map((d) => d.branchName).filter(Boolean))).map((branch) => ({
    value: branch,
    label: branch,
  }));

  const departmentOptions = Array.from(new Set(data.map((d) => d.departmentName).filter(Boolean))).map((dept) => ({
    value: dept,
    label: dept,
  }));

  // Edit handler
  const handleEdit = (record: DoctorDto) => {
    // Navigates to the Edit page/form with ID
    navigate(`/doctors/${record.id}/edit`, { state: { doctor: record } });
  };

  // Delete handler
  const handleDelete = async (id: number) => {
    try {
      await deleteDoctor(id);
      notify("Doctor record deleted successfully");
      fetchDoctors();
    } catch (error) {
      console.error("Delete doctor error:", error);
      notify("Delete failed");
    }
  };

  const columns: TableColumn<DoctorDto>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "70px",
    },
    {
      name: "Doctor Name",
      selector: (row) => row.doctorName || "-",
      sortable: true,
      grow: 2,
      wrap: true,
      cell: (row) => (
        <div className="d-flex align-items-center gap-2"><MedicineBoxOutlined className="text-primary" /><strong className="text-dark">{row.doctorName || "-"}</strong></div>
      ),
    },
    {
      name: "Specialization",
      selector: (row) => row.specialization || "-",
      sortable: true,
      grow: 1.5,
      wrap: true,
      cell: (row) => <span className="fw-semibold text-dark">{row.specialization || "-"}</span>,
    },
    {
      name: "License No.",
      selector: (row) => row.licenseNumber || "-",
      sortable: true,
      hide: 768,
      width: "150px",
      cell: (row) => (
        <span style={{ 
          background: "#f1f5f9", 
          padding: "2px 8px", 
          borderRadius: "6px", 
          border: "1px solid #e2e8f0", 
          fontFamily: "monospace",
          fontWeight: 600,
          color: "#475569",
          fontSize: "12px"
        }}>
          {row.licenseNumber || "-"}
        </span>
      ),
    },
    {
      name: "Branch",
      selector: (row) => row.branchName || `Branch #${row.branchId}`,
      sortable: true,
      width: "160px",
    },
    {
      name: "Department",
      selector: (row) => row.departmentName || `Dept #${row.departmentId || "-"}`,
      sortable: true,
      width: "160px",
    },
    {
  name: "Consultation Fee",
  selector: (row) => row.consultationFee || 0,
  sortable: true,
  right: true,
  width: "160px",
  cell: (row) => {
    const fee = row.consultationFee;
    const formattedFee =
      fee !== undefined && fee !== null
        ? new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
          }).format(fee)
        : "—";

    return (
      <strong className="text-dark" style={{ fontFamily: "monospace" }}>
        {formattedFee}
      </strong>
    );
  },
},
    {
      name: "Status",
      selector: (row) => row.isActive,
      sortable: true,
      center: true,
      width: "120px",
      cell: (row) => (
        <Badge bg={row.isActive ? "success" : "danger"}>{row.isActive ? "ACTIVE" : "INACTIVE"}</Badge>
      ),
    },
    {
      name: "Actions",
      width: "120px",
      center: true,
      cell: (row) => (
        <div className="d-flex gap-2"><Button variant="outline-primary" size="sm" onClick={() => handleEdit(row)}><EditOutlined /></Button><Button variant="outline-danger" size="sm" onClick={() => { if (window.confirm("Delete this doctor?")) handleDelete(row.id); }}><DeleteOutlined /></Button></div>
      ),
    },
  ];

  const filteredData = data.filter((doc) => {
    const matchesBranch = selectedBranchFilter ? doc.branchName === selectedBranchFilter : true;
    const matchesDept = selectedDeptFilter ? doc.departmentName === selectedDeptFilter : true;
    const matchesStatus = selectedStatusFilter !== undefined ? doc.isActive === selectedStatusFilter : true;

    const search = searchText.trim().toLowerCase();
    const matchesSearch = !search || [
      doc.doctorName,
      doc.specialization,
      doc.licenseNumber,
      doc.branchName,
      doc.departmentName,
      doc.createdUser,
      doc.updateUser,
    ]
      .filter(Boolean)
      .some((val) => String(val).toLowerCase().includes(search));

    return matchesBranch && matchesDept && matchesStatus && matchesSearch;
  });

  const handleResetAll = () => {
    setSearchText("");
    setSelectedBranchFilter(undefined);
    setSelectedDeptFilter(undefined);
    setSelectedStatusFilter(undefined);
    fetchDoctors();
  };

  return (
    <div className="doctor-page p-2 p-md-4 bg-light min-vh-100"><div className="mx-auto" style={{ maxWidth: 1500 }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3"><div className="flex-grow-1"><h3 className="mb-1 fw-bold text-dark">Doctor Master</h3><p className="text-muted mb-0">Manage doctor profiles, medical licenses, consultation fees, and branch assignments.</p></div><Button variant="primary" className="doctor-add-button d-flex align-items-center justify-content-center gap-2" onClick={() => navigate("/doctor/add")}><PlusOutlined /> Add New</Button></div>
      <Card className="border-0 shadow-sm rounded-4"><Card.Body className="p-2 p-md-4">
        <div className="bg-light rounded-3 border p-3 mb-3"><div className="d-flex align-items-center gap-2 mb-3"><FilterOutlined className="text-primary" /><strong>Filter & Search Parameters</strong></div><Row className="g-3"><Col xs={12} md={6} lg={4}><div className="position-relative"><SearchOutlined className="position-absolute top-50 translate-middle-y ms-3 text-secondary" /><Form.Control className="ps-5" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search name, license, department..." /></div></Col><Col xs={12} sm={6} lg={3}><Form.Select value={selectedBranchFilter || ""} onChange={(e) => setSelectedBranchFilter(e.target.value || undefined)}><option value="">Filter by Branch</option>{branchOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Form.Select></Col><Col xs={12} sm={6} lg={3}><Form.Select value={selectedDeptFilter || ""} onChange={(e) => setSelectedDeptFilter(e.target.value || undefined)}><option value="">Filter by Department</option>{departmentOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Form.Select></Col><Col xs={12} sm={6} lg={1}><Form.Select value={selectedStatusFilter === undefined ? "" : String(selectedStatusFilter)} onChange={(e) => setSelectedStatusFilter(e.target.value === "" ? undefined : e.target.value === "true")}><option value="">Status</option><option value="true">Active</option><option value="false">Inactive</option></Form.Select></Col><Col xs={12} sm={6} lg={1}><Button variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-center" onClick={handleResetAll} disabled={loading}>{loading ? <Spinner animation="border" size="sm" /> : <ReloadOutlined />}</Button></Col></Row></div>
        <div className="d-flex justify-content-between align-items-center mb-3"><small className="text-muted">Showing <strong>{filteredData.length}</strong> entries</small></div>
        <DataTable className="doctor-data-table" columns={columns} data={filteredData} keyField="id" pagination paginationPerPage={10} paginationRowsPerPageOptions={[10, 20, 50, 100]} progressPending={loading} persistTableHead highlightOnHover responsive noDataComponent={<div className="py-4 text-muted">No doctors found</div>} customStyles={{ headCells: { style: { fontWeight: 600, backgroundColor: "#f8fafc" } }, rows: { style: { minHeight: "58px" } }, cells: { style: { paddingLeft: "10px", paddingRight: "10px" } } }} />
      </Card.Body></Card>
    </div></div>
  );
};

export default Doctor;