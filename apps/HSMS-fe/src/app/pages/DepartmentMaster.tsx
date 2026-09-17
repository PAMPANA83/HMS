import { Card, Button, Modal, Form, Row, Col, Spinner } from "react-bootstrap";
import DataTable, { type TableColumn } from "react-data-table-component";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, FilterOutlined, ApartmentOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState, useMemo } from "react";

import { getBranch } from "../services/Branch.service";
import {
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/Department.service";

import {
  DepartmentDto,
  CreateDepartmentDto,
} from "../models/Department.dto";

const notify = (text: string) => window.alert(text);

interface BranchOption {
  id?: number; 
  branchName?: string;
}

const extractDataArray = <T,>(result: unknown): T[] => {
  if (!result || typeof result !== "object") return [];
  const response = result as { data?: unknown };
  if (Array.isArray(result)) return result;
  if (Array.isArray(response.data)) return response.data as T[];
  if (response.data && typeof response.data === "object" && Array.isArray((response.data as { data?: unknown }).data)) {
    return (response.data as { data: T[] }).data;
  }
  return [];
};

export function Departments() {
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [branches, setBranches] = useState<BranchOption[]>([]);

  const [loading, setLoading] = useState(false);
  const [branchLoading, setBranchLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentDto | null>(null);

  // Filter States
  const [searchText, setSearchText] = useState("");
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<number | undefined>(undefined);

  // Multi-select & Batch Delete States
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [batchDeleteLoading, setBatchDeleteLoading] = useState(false);
  const [formData, setFormData] = useState<CreateDepartmentDto>({ branchId: 0, name: "", code: "" });

  const loadDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getDepartment();
      const data = extractDataArray<DepartmentDto>(response);
      setDepartments(data);
    } catch (error) {
      console.error("Failed to load departments:", error);
      notify("Failed to load departments");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBranches = useCallback(async () => {
    setBranchLoading(true);
    try {
      const response = await getBranch();
      const data = extractDataArray<BranchOption>(response);
      setBranches(data);
    } catch (error) {
      console.error("Failed to load branches:", error);
      notify("Failed to load branches");
    } finally {
      setBranchLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDepartments();
    loadBranches();
  }, [loadDepartments, loadBranches]);

  // Filtered Data Computation
  const filteredDepartments = useMemo(() => {
    return departments.filter((item) => {
      const matchesBranch = selectedBranchFilter 
        ? item.branchId === selectedBranchFilter 
        : true;
      
      const searchLower = searchText.toLowerCase();
      const matchesSearch = 
        !searchText ||
        item.name?.toLowerCase().includes(searchLower) ||
        item.code?.toLowerCase().includes(searchLower) ||
        item.branchName?.toLowerCase().includes(searchLower);

      return matchesBranch && matchesSearch;
    });
  }, [departments, selectedBranchFilter, searchText]);

  const handleOpenAddModal = () => {
    setEditingDepartment(null);
    setFormData({ branchId: 0, name: "", code: "" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record: DepartmentDto) => {
    setEditingDepartment(record);
    setFormData({
      branchId: record.branchId,
      name: record.name,
      code: record.code,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (submitLoading) return;
    setIsModalOpen(false);
    setEditingDepartment(null);
    setFormData({ branchId: 0, name: "", code: "" });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.branchId || formData.name.trim().length < 2 || formData.code.trim().length < 2) {
      notify("Please complete the branch, department name, and code fields.");
      return;
    }
    try {
      setSubmitLoading(true);

      const payload: CreateDepartmentDto = {
        branchId: Number(formData.branchId),
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
      };

      if (editingDepartment?.id) {
        await updateDepartment(editingDepartment.id, payload as unknown as DepartmentDto);
        notify("Department updated successfully");
      } else {
        await createDepartment(payload as unknown as DepartmentDto);
        notify("Department created successfully");
      }

      setIsModalOpen(false);
      setEditingDepartment(null);
      setFormData({ branchId: 0, name: "", code: "" });
      await loadDepartments();
    } catch (error: unknown) {
      console.error("Submit error:", error);
      notify(error instanceof Error ? error.message : "Operation failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDepartment(id);
      notify("Department deleted successfully");
      await loadDepartments();
    } catch (error: unknown) {
      console.error("Delete error:", error);
      notify(error instanceof Error ? error.message : "Failed to delete department");
    }
  };

  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    if (!window.confirm(`Delete ${selectedRowKeys.length} selected departments?`)) return;
    try {
      setBatchDeleteLoading(true);
      await Promise.all(selectedRowKeys.map((id) => deleteDepartment(Number(id))));
      notify(`Successfully deleted ${selectedRowKeys.length} departments`);
      setSelectedRowKeys([]);
      await loadDepartments();
    } catch (error: unknown) {
      console.error("Batch delete error:", error);
      notify("Failed to delete selected departments");
    } finally {
      setBatchDeleteLoading(false);
    }
  };

  const columns: TableColumn<DepartmentDto>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Branch Name",
      selector: (row) => row.branchName || "-",
      sortable: true,
      cell: (row) => (
        <div className="d-flex align-items-center gap-2">
          <ApartmentOutlined className="text-primary" />
          <strong className="text-dark">{row.branchName || "-"}</strong>
        </div>
      ),
    },
    {
      name: "Department Name",
      selector: (row) => row.name || "-",
      sortable: true,
      cell: (row) => <span className="fw-semibold text-dark">{row.name || "-"}</span>,
    },
    {
      name: "Code",
      selector: (row) => row.code || "-",
      sortable: true,
      cell: (row) => (
        <span style={{ 
          background: "#f1f5f9", 
          padding: "2px 8px", 
          borderRadius: "6px", 
          border: "1px solid #e2e8f0", 
          fontFamily: "monospace",
          fontWeight: 600,
          color: "#475569"
        }}>
          {row.code?.toUpperCase() || "-"}
        </span>
      ),
    },
    {
      name: "Actions",
      width: "120px",
      center: true,
      cell: (row) => (
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm" onClick={() => handleOpenEditModal(row)}><EditOutlined /></Button>
          <Button variant="outline-danger" size="sm" onClick={() => { if (window.confirm("Delete this department?")) handleDelete(row.id); }}><DeleteOutlined /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="department-page p-2 p-md-4 bg-light min-vh-100"><div className="mx-auto" style={{ maxWidth: 1200 }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3"><div><h3 className="mb-1 fw-bold text-dark">Departments Management</h3><p className="text-muted mb-0">Manage internal departments, codes, and operational branch mappings.</p></div><Button variant="primary" onClick={handleOpenAddModal} className="department-add-button d-flex align-items-center justify-content-center gap-2"><PlusOutlined /> Add Department</Button></div>
      <Card className="border-0 shadow-sm rounded-4"><Card.Body className="p-2 p-md-4">
        <div className="bg-light rounded-3 border p-3 mb-3"><div className="d-flex align-items-center gap-2 mb-3"><FilterOutlined className="text-primary" /><strong>Filter & Search</strong></div><Row className="g-3"><Col xs={12} md={5}><div className="position-relative"><SearchOutlined className="position-absolute top-50 translate-middle-y ms-3 text-secondary" /><Form.Control className="ps-5" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search by name, code, or branch..." /></div></Col><Col xs={12} md={5}><Form.Select disabled={branchLoading} value={selectedBranchFilter || ""} onChange={(e) => setSelectedBranchFilter(e.target.value ? Number(e.target.value) : undefined)}><option value="">Filter by Branch</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.branchName}</option>)}</Form.Select></Col><Col xs={12} md={2}><Button variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-center gap-2" onClick={() => { setSearchText(""); setSelectedBranchFilter(undefined); }}><ReloadOutlined /> Reset</Button></Col></Row></div>
        {selectedRowKeys.length > 0 && <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 bg-primary-subtle border border-primary-subtle p-3 rounded-3 mb-3"><span className="text-primary">Selected <strong>{selectedRowKeys.length}</strong> items</span><Button variant="danger" disabled={batchDeleteLoading} onClick={handleBatchDelete} className="d-flex align-items-center gap-2">{batchDeleteLoading && <Spinner animation="border" size="sm" />}<DeleteOutlined /> Delete Selected</Button></div>}
        <DataTable className="department-data-table" columns={columns} data={filteredDepartments} keyField="id" selectableRows selectableRowsHighlight onSelectedRowsChange={({ selectedRows }) => setSelectedRowKeys(selectedRows.map((row) => row.id))} clearSelectedRows={selectedRowKeys.length === 0} pagination paginationPerPage={5} paginationRowsPerPageOptions={[5, 10, 20, 50, 100]} progressPending={loading} persistTableHead highlightOnHover responsive noDataComponent={<div className="py-4 text-muted">No departments found</div>} customStyles={{ headCells: { style: { fontWeight: 600, backgroundColor: "#f8fafc" } }, rows: { style: { minHeight: "56px" } } }} />
      </Card.Body></Card>

      <Modal show={isModalOpen} onHide={handleCloseModal} centered><Modal.Header closeButton><Modal.Title>{editingDepartment ? "Edit Department" : "Create Department"}</Modal.Title></Modal.Header><Form onSubmit={handleSubmit}><Modal.Body><Form.Group className="mb-3"><Form.Label>Branch</Form.Label><Form.Select required disabled={branchLoading} value={formData.branchId || ""} onChange={(e) => setFormData((previous) => ({ ...previous, branchId: Number(e.target.value) }))}><option value="">{branchLoading ? "Loading branches..." : "Select branch"}</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.branchName}</option>)}</Form.Select></Form.Group><Form.Group className="mb-3"><Form.Label>Department Name</Form.Label><Form.Control required minLength={2} value={formData.name} onChange={(e) => setFormData((previous) => ({ ...previous, name: e.target.value }))} placeholder="Cardiology" /></Form.Group><Form.Group><Form.Label>Department Code</Form.Label><Form.Control required minLength={2} maxLength={10} value={formData.code} onChange={(e) => setFormData((previous) => ({ ...previous, code: e.target.value.toUpperCase() }))} placeholder="CARD" /></Form.Group></Modal.Body><Modal.Footer><Button variant="secondary" type="button" onClick={handleCloseModal}>Cancel</Button><Button variant="primary" type="submit" disabled={submitLoading}>{submitLoading && <Spinner animation="border" size="sm" className="me-2" />}{editingDepartment ? "Update Department" : "Create Department"}</Button></Modal.Footer></Form></Modal>
    </div></div>
  );
}