import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import {
  ArrowClockwise,
  EyeFill,
  Filter,
  PersonCircle,
  PlusLg,
  Search,
  TrashFill,
} from "react-bootstrap-icons";
import DataTable, { type TableColumn } from "react-data-table-component";
import { message } from "antd";

import { getUser, deleteUser } from "../services/UserLogin.service";
import { EmployeeDto } from "../models/User.dto";

const extractDataArray = <T,>(result: any): T[] => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.data?.data)) return result.data.data;
  return [];
};

export function User() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<EmployeeDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string | undefined>(undefined);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<EmployeeDto | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUser();
      const data = extractDataArray<EmployeeDto>(response);
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
      message.error("Failed to load user list");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const roleOptions = useMemo(() => {
    const rolesMap = new Map<string, string>();
    users.forEach((user) => {
      if (user.roleCode && user.roleName) {
        rolesMap.set(user.roleCode, user.roleName);
      }
    });

    return Array.from(rolesMap.entries()).map(([code, name]) => ({
      value: code,
      label: `${name} (${code})`,
    }));
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const matchesRole = selectedRoleFilter ? item.roleCode === selectedRoleFilter : true;
      const searchLower = searchText.toLowerCase();
      const matchesSearch =
        !searchText ||
        item.fullName?.toLowerCase().includes(searchLower) ||
        item.employeeCode?.toLowerCase().includes(searchLower) ||
        item.email?.toLowerCase().includes(searchLower) ||
        item.departmentName?.toLowerCase().includes(searchLower);

      return matchesRole && matchesSearch;
    });
  }, [users, selectedRoleFilter, searchText]);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!window.confirm("Delete this user? This action cannot be undone.")) {
        return;
      }

      try {
        await deleteUser(id);
        message.success("User deleted successfully");
        await loadUsers();
      } catch (error: any) {
        console.error("Delete error:", error);
        message.error(error?.response?.data?.message || "Failed to delete user");
      }
    },
    [loadUsers]
  );

  const columns: TableColumn<EmployeeDto>[] = useMemo(
    () => [
      {
        name: "Employee Code",
        selector: (row) => row.employeeCode || "-",
        sortable: true,
        width: "160px",
        cell: (row) => (
          <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 fw-semibold">
            {row.employeeCode || "-"}
          </span>
        ),
      },
      {
        name: "Full Name",
        selector: (row) => row.fullName || "-",
        sortable: true,
        minWidth: "220px",
        cell: (row) => (
          <div className="d-flex align-items-center gap-2 py-2">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle text-white fw-semibold"
              style={{
                width: 28,
                height: 28,
                backgroundColor: "#3b82f6",
                fontSize: 12,
              }}
            >
              {row.fullName ? row.fullName.charAt(0).toUpperCase() : <PersonCircle size={14} />}
            </div>
            <span className="fw-semibold text-dark">{row.fullName || "-"}</span>
          </div>
        ),
      },
      {
        name: "Role",
        selector: (row) => row.roleName || "-",
        sortable: true,
        minWidth: "220px",
        cell: (row) => (
          <div>
            <div className="text-dark">{row.roleName || "-"}</div>
            {row.roleCode && (
              <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle mt-1">
                {row.roleCode}
              </span>
            )}
          </div>
        ),
      },
      {
        name: "Department",
        selector: (row) => row.departmentName || "-",
        sortable: true,
        hide: 768,
        minWidth: "180px",
        cell: (row) => <span className="text-secondary">{row.departmentName || "-"}</span>,
      },
      {
        name: "Email",
        selector: (row) => row.email || "-",
        sortable: true,
        minWidth: "250px",
        hide: 980,
        cell: (row) => <span className="text-secondary">{row.email || "-"}</span>,
      },
      {
        name: "Status",
        selector: (row) => (row.isActive ? "Active" : "Inactive"),
        sortable: true,
        width: "120px",
        center: true,
        cell: (row) => (
          <span
            className={`badge rounded-pill ${row.isActive ? "bg-success-subtle text-success border border-success-subtle" : "bg-danger-subtle text-danger border border-danger-subtle"}`}
            style={{ fontWeight: 500 }}
          >
            {row.isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        name: "Actions",
        button: true,
        width: "120px",
        center: true,
        cell: (row) => (
          <div className="d-flex gap-2 justify-content-center">
            <Button
              variant="outline-primary"
              size="sm"
              className="d-flex align-items-center justify-content-center"
              onClick={() => {
                setSelectedUser(row);
                setIsDetailModalOpen(true);
              }}
              aria-label="View user"
            >
              <EyeFill size={14} />
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              className="d-flex align-items-center justify-content-center"
              onClick={() => handleDelete(row.id)}
              aria-label="Delete user"
            >
              <TrashFill size={14} />
            </Button>
          </div>
        ),
      },
    ],
    [handleDelete]
  );

  return (
    <div className="bg-light min-vh-100 p-3 p-md-4">
      <div className="mx-auto" style={{ maxWidth: 1500 }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div className="flex-grow-1">
            <h3 className="mb-1 fw-bold text-dark">User & Employee Management</h3>
            <p className="text-muted mb-0">Manage employee directories, organizational roles, and user access parameters.</p>
          </div>
          <Button
            variant="primary"
            className="d-flex align-items-center justify-content-center gap-2 px-3 py-2 rounded-3 fw-semibold"
            onClick={() => navigate("/users/add")}
          >
            <PlusLg size={18} /> Add User
          </Button>
        </div>

        <Card className="border-0 shadow-sm rounded-4">
          <Card.Body className="p-2 p-md-4">
            <div className="bg-light rounded-3 border p-3 mb-3">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Filter className="text-primary" />
                <strong className="text-dark">Filter & Search Parameters</strong>
              </div>

              <Row className="g-3 align-items-center">
                <Col xs={12} md={6} lg={5}>
                  <div className="position-relative">
                    <Search className="position-absolute top-50 translate-middle-y ms-3 text-secondary" style={{ left: 18 }} />
                    <Form.Control
                      className="ps-5"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search by name, code, email, department..."
                    />
                  </div>
                </Col>

                <Col xs={12} md={4} lg={5}>
                  <Form.Select
                    value={selectedRoleFilter || ""}
                    onChange={(e) => setSelectedRoleFilter(e.target.value || undefined)}
                  >
                    <option value="">Filter by Role</option>
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Col>

                <Col xs={12} md={2} lg={2}>
                  <Button
                    variant="outline-secondary"
                    className="w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => {
                      setSearchText("");
                      setSelectedRoleFilter(undefined);
                    }}
                  >
                    <ArrowClockwise /> Reset
                  </Button>
                </Col>
              </Row>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <small className="text-muted">
                Showing <strong>{filteredUsers.length}</strong> {filteredUsers.length === 1 ? "user" : "users"}
              </small>
            </div>

            <DataTable
              className="user-data-table"
              columns={columns}
              data={filteredUsers}
              keyField="id"
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
              progressPending={loading}
              persistTableHead
              highlightOnHover
              responsive
              striped
              noDataComponent={<div className="py-4 text-muted">No users found</div>}
              customStyles={{
                headCells: {
                  style: { fontWeight: 600, color: "#334155", backgroundColor: "#f8fafc" },
                },
                rows: { style: { minHeight: "58px" } },
                cells: { style: { paddingLeft: "10px", paddingRight: "10px" } },
              }}
            />
          </Card.Body>
        </Card>

        <Modal show={isDetailModalOpen} onHide={() => setIsDetailModalOpen(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title className="fw-semibold">User Profile Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <div>
                <div className="d-flex align-items-center gap-3 border-bottom pb-3 mb-3">
                 <div
    className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold overflow-hidden flex-shrink-0 shadow-sm"
    style={{ 
      width: "64px", 
      height: "64px", 
      backgroundColor: "#3b82f6", 
      fontSize: "24px" 
    }}
  >
    {selectedUser.profileImageUrl ? (
      <img
        src={selectedUser.profileImageUrl}
        alt={selectedUser.fullName || "User Profile"}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    ) : selectedUser.fullName ? (
      selectedUser.fullName.charAt(0).toUpperCase()
    ) : (
      <PersonCircle size={28} />
    )}
  </div>
                  <div>
                    <div className="fw-semibold fs-5 text-dark">{selectedUser.fullName || "-"}</div>
                    <div className="text-secondary small">{selectedUser.email || "-"}</div>
                  </div>
                </div>

                <div className="row g-3 bg-light p-3 rounded-3 border">
                  <div className="col-6">
                    <small className="text-secondary d-block">Employee Code</small>
                    <strong className="text-dark font-monospace">{selectedUser.employeeCode || "-"}</strong>
                  </div>
                  <div className="col-6">
                    <small className="text-secondary d-block">Company</small>
                    <strong className="text-dark">{selectedUser.companyName || "-"}</strong>
                  </div>
                  <div className="col-6">
                    <small className="text-secondary d-block">Department</small>
                    <strong className="text-dark">{selectedUser.departmentName || "-"}</strong>
                  </div>
                  <div className="col-6">
                    <small className="text-secondary d-block">Role</small>
                    <strong className="text-dark">
                      {selectedUser.roleName || "-"}
                      {selectedUser.roleCode ? ` (${selectedUser.roleCode})` : ""}
                    </strong>
                  </div>
                  <div className="col-6">
                    <small className="text-secondary d-block">Phone Number</small>
                    <strong className="text-dark">{selectedUser.phone || "-"}</strong>
                  </div>
                  <div className="col-6">
                    <small className="text-secondary d-block">Joined Date</small>
                    <strong className="text-dark">
                      {selectedUser.joinedDate ? new Date(selectedUser.joinedDate).toLocaleDateString("en-IN") : "-"}
                    </strong>
                  </div>
                  <div className="col-12">
                    <small className="text-secondary d-block">Location</small>
                    <strong className="text-dark">
                      {[selectedUser.cityName, selectedUser.stateName, selectedUser.countryName].filter(Boolean).join(", ") || "-"}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
