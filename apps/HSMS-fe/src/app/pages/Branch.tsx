import { Card, Button, Form, Badge, Row, Col, Spinner } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import { BranchMastersDto } from "../models/Branch.dto";
import { useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  EnvironmentOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";

import {
  getBranch,
  deleteBranch,
} from "../services/Branch.service";

const notify = (text: string) => window.alert(text);

export function Branch() {
  const navigate = useNavigate();
  const [data, setData] = useState<BranchMastersDto[]>([]);
  const [loading, setLoading] = useState(false);

  // Search & Filters
  const [searchText, setSearchText] = useState("");
  const [selectedCityFilter, setSelectedCityFilter] = useState<string | undefined>(undefined);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<boolean | undefined>(undefined);

  // Multi-select & Batch Delete States
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [batchDeleteLoading, setBatchDeleteLoading] = useState(false);

  // Load Branches
  const loadBranches = async () => {
    setLoading(true);

    try {
      const result = await getBranch();
      setData(result);
    } catch (error) {
      console.error("Branch loading error:", error);
      notify("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    loadBranches();
  }, []);

  // Unique city list for filter dropdown
  const cityOptions = useMemo(() => {
    return Array.from(
      new Set(
        data
          .map((x) => x.cityName)
          .filter(Boolean)
      )
    ).map((city) => ({
      value: city,
      label: city,
    }));
  }, [data]);

  // Global Search & Advanced Filtering
  const filteredData = useMemo(() => {
    const search = searchText.toLowerCase().trim();

    return data.filter((item) => {
      const matchesCity = selectedCityFilter ? item.cityName === selectedCityFilter : true;
      const matchesStatus = selectedStatusFilter !== undefined ? item.isActive === selectedStatusFilter : true;

      const matchesSearch = !search || [
        item.branchName,
        item.branchCode,
        item.companyName,
        item.email,
        item.phone,
        item.addressLine1,
        item.addressLine2,
        item.cityName,
        item.stateName,
        item.countryName,
        item.postalCode,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(search)
        );

      return matchesCity && matchesStatus && matchesSearch;
    });
  }, [data, searchText, selectedCityFilter, selectedStatusFilter]);

  // Edit
  const handleEdit = (record: BranchMastersDto) => {
    console.log("Edit Branch:", record);
    // Open your Edit Modal here
  };

  // Delete Single
  const handleDelete = async (id: number) => {
    try {
      await deleteBranch(id);
      notify("Branch deleted successfully");
      loadBranches();
    } catch (error) {
      console.error("Delete branch error:", error);
      notify("Delete failed");
    }
  };

  // Batch Delete
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    if (!window.confirm(`Delete ${selectedRowKeys.length} selected branches?`)) return;
    try {
      setBatchDeleteLoading(true);
      await Promise.all(selectedRowKeys.map((id) => deleteBranch(Number(id))));
      notify(`Successfully deleted ${selectedRowKeys.length} branches`);
      setSelectedRowKeys([]);
      await loadBranches();
    } catch (error: unknown) {
      console.error("Batch delete error:", error);
      notify("Failed to delete selected branches");
    } finally {
      setBatchDeleteLoading(false);
    }
  };

  // Table Columns
  const columns: TableColumn<BranchMastersDto>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "70px",
    },
    {
      name: "Branch Name",
      selector: (row) => row.branchName || "-",
      sortable: true,
      grow: 2,
      wrap: true,
      cell: (row) => (
        <div className="d-flex align-items-center gap-2">
          <EnvironmentOutlined className="text-primary" />
          <strong className="text-dark">{row.branchName || "-"}</strong>
        </div>
      ),
    },
    {
      name: "Branch Code",
      selector: (row) => row.branchCode || "-",
      sortable: true,
      width: "140px",
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
          {row.branchCode || "-"}
        </span>
      ),
    },
    {
      name: "Company",
      selector: (row) => row.companyName || "-",
      sortable: true,
      grow: 1.5,
      wrap: true,
    },
    {
      name: "Email",
      selector: (row) => row.email || "-",
      hide: 768,
      width: "220px",
    },
    {
      name: "Phone",
      selector: (row) => row.phone || "-",
      hide: 768,
      width: "150px",
    },
    {
      name: "Address",
      selector: (row) => row.addressLine1 || "-",
      hide: 768,
      width: "230px",
    },
    {
      name: "City",
      selector: (row) => row.cityName || "-",
      sortable: true,
      width: "140px",
    },
    {
      name: "State",
      selector: (row) => row.stateName || "-",
      sortable: true,
      width: "140px",
    },
    {
      name: "Country",
      selector: (row) => row.countryName || "-",
      hide: 768,
      width: "130px",
    },
    {
      name: "Postal Code",
      selector: (row) => row.postalCode || "-",
      hide: 768,
      width: "120px",
    },
    {
      name: "Main Branch",
      selector: (row) => row.isMainBranch,
      sortable: true,
      center: true,
      width: "130px",
      cell: (row) => (
        <Badge bg={row.isMainBranch ? "primary" : "secondary"}>{row.isMainBranch ? "Yes" : "No"}</Badge>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.isActive,
      sortable: true,
      center: true,
      width: "120px",
      cell: (row) => (
        <Badge bg={row.isActive ? "success" : "danger"}>{row.isActive ? "Active" : "Inactive"}</Badge>
      ),
    },
    {
      name: "Created",
      selector: (row) => row.createdAt || "",
      sortable: true,
      hide: 768,
      width: "130px",
      sortFunction: (first, second) => new Date(first.createdAt || 0).getTime() - new Date(second.createdAt || 0).getTime(),
      cell: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-IN") : "-",
    },
    {
      name: "Actions",
      width: "120px",
      center: true,
      cell: (row) => (
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm" onClick={() => handleEdit(row)}><EditOutlined /></Button>
          <Button variant="outline-danger" size="sm" onClick={() => { if (window.confirm("Delete this branch?")) handleDelete(row.id); }}><DeleteOutlined /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="branch-page p-2 p-md-4 bg-light min-vh-100">
      <div className="mx-auto" style={{ maxWidth: 1500 }}>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div className="flex-grow-1">
            <h3 className="mb-1 fw-bold text-dark">Branch Management</h3>
            <p className="text-muted mb-0">Configure and monitor corporate organization locations effortlessly.</p>
          </div>
          <Button variant="primary" className="branch-add-button d-flex align-items-center justify-content-center gap-2" onClick={() => navigate("/Branch/Add")}>
            <PlusOutlined /> Add Branch
          </Button>
        </div>

        <Card className="border-0 shadow-sm rounded-4">
          <Card.Body className="p-2 p-md-4">
            <div className="bg-light rounded-3 border p-3 mb-3">
              <div className="d-flex align-items-center gap-2 mb-3"><FilterOutlined className="text-primary" /><strong>Filter & Search Parameters</strong></div>
              <Row className="g-3 align-items-center">
                <Col xs={12} md={6} lg={5}><div className="position-relative"><SearchOutlined className="position-absolute top-50 translate-middle-y ms-3 text-secondary" /><Form.Control className="ps-5" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search branch, company, city, state..." /></div></Col>
                <Col xs={12} md={3} lg={3}><Form.Select value={selectedCityFilter || ""} onChange={(e) => setSelectedCityFilter(e.target.value || undefined)}><option value="">Filter by City</option>{cityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Form.Select></Col>
                <Col xs={12} md={3} lg={2}><Form.Select value={selectedStatusFilter === undefined ? "" : String(selectedStatusFilter)} onChange={(e) => setSelectedStatusFilter(e.target.value === "" ? undefined : e.target.value === "true")}><option value="">Filter by Status</option><option value="true">Active</option><option value="false">Inactive</option></Form.Select></Col>
                <Col xs={12} md={12} lg={2}><Button variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-center gap-2" onClick={() => { setSearchText(""); setSelectedCityFilter(undefined); setSelectedStatusFilter(undefined); }}><ReloadOutlined /> Reset</Button></Col>
              </Row>
            </div>

            {selectedRowKeys.length > 0 && <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 bg-primary-subtle border border-primary-subtle p-3 rounded-3 mb-3"><span className="text-primary">Selected <strong>{selectedRowKeys.length}</strong> items</span><Button variant="danger" disabled={batchDeleteLoading} onClick={handleBatchDelete} className="d-flex align-items-center gap-2">{batchDeleteLoading && <Spinner animation="border" size="sm" />}<DeleteOutlined /> Delete Selected</Button></div>}

            <div className="d-flex justify-content-between align-items-center mb-3"><small className="text-muted">Showing <strong>{filteredData.length}</strong> entries</small></div>
            <DataTable
              className="branch-data-table"
              columns={columns}
              data={filteredData}
              keyField="id"
              selectableRows
              selectableRowsHighlight
              onSelectedRowsChange={({ selectedRows }) => setSelectedRowKeys(selectedRows.map((row) => row.id))}
              clearSelectedRows={selectedRowKeys.length === 0}
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
              progressPending={loading}
              persistTableHead
              highlightOnHover
              responsive
              noDataComponent={<div className="py-4 text-muted">No branches found</div>}
              customStyles={{ headCells: { style: { fontWeight: 600, color: "#334155", backgroundColor: "#f8fafc" } }, rows: { style: { minHeight: "58px" } }, cells: { style: { paddingLeft: "10px", paddingRight: "10px" } } }}
            />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}