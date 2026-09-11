import {
  Table,
  Card,
  Button,
  Modal,
  Input,
  message,
  Select,
  Tag,
  Space,
  Row,
  Col,
  Typography,
  Tooltip,
  Avatar,
} from "antd";
import type { TableProps } from "antd";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  PlusOutlined,
  UserOutlined,
  FilterOutlined,
} from "@ant-design/icons";

import { getUser, deleteUser } from "../services/UserLogin.service";
import { EmployeeDto } from "../models/User.dto";

const { Title, Text } = Typography;

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

  // Filter States
  const [searchText, setSearchText] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string | undefined>(undefined);

  // Detail Modal State
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

  // Extract unique role options dynamically from loaded users
  const roleOptions = useMemo(() => {
    const rolesMap = new Map();
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

  // Filtered Data Computation
  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const matchesRole = selectedRoleFilter 
        ? item.roleCode === selectedRoleFilter 
        : true;
      
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
      Modal.confirm({
        title: "Delete User?",
        content: "This action cannot be undone.",
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            await deleteUser(id);
            message.success("User deleted successfully");
            await loadUsers();
          } catch (error: any) {
            console.error("Delete error:", error);
            message.error(error?.response?.data?.message || "Failed to delete user");
          }
        },
      });
    },
    [loadUsers]
  );

  const columns: TableProps<EmployeeDto>["columns"] = useMemo(
    () => [
      {
        title: "Employee Code",
        dataIndex: "employeeCode",
        key: "employeeCode",
        width: 150,
        fixed: "left",
        render: (code: string) => (
          <span style={{ 
            background: "#eff6ff", 
            padding: "2px 8px", 
            borderRadius: "6px", 
            border: "1px solid #bfdbfe", 
            fontWeight: 500,
            color: "#1d4ed8",
            fontSize: "12px",
            fontFamily: "monospace"
          }}>
            {code || "-"}
          </span>
        ),
      },
      {
        title: "Full Name",
        dataIndex: "fullName",
        key: "fullName",
        width: 200,
        ellipsis: true,
        render: (name: string) => (
          <Space size={10}>
            <Avatar size="small" style={{ backgroundColor: "#3b82f6", fontWeight: 600 }}>
              {name ? name.charAt(0).toUpperCase() : <UserOutlined />}
            </Avatar>
            <Text strong style={{ color: "#1e293b" }}>{name || "-"}</Text>
          </Space>
        ),
      },
      {
        title: "Role",
        dataIndex: "roleName",
        key: "roleName",
        width: 200,
        render: (role: string, record) => (
          <div>
            <Text style={{ color: "#334155", display: "block" }}>{role || "-"}</Text>
            {record.roleCode && (
              <span style={{ 
                background: "#f0fdf4", 
                color: "#15803d", 
                border: "1px solid #bbf7d0", 
                padding: "1px 6px", 
                borderRadius: "4px", 
                fontSize: "11px",
                fontWeight: 500
              }}>
                {record.roleCode}
              </span>
            )}
          </div>
        ),
      },
      {
        title: "Department",
        dataIndex: "departmentName",
        key: "departmentName",
        width: 160,
        render: (dept: string) => <Text style={{ color: "#475569" }}>{dept || "-"}</Text>,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 220,
        ellipsis: true,
        render: (email: string) => <Text style={{ color: "#64748b" }}>{email || "-"}</Text>,
      },
      {
        title: "Status",
        dataIndex: "isActive",
        key: "isActive",
        width: 110,
        align: "center",
        render: (isActive: boolean) => (
          <span style={{
            background: isActive ? "#f0fdf4" : "#fef2f2",
            color: isActive ? "#15803d" : "#b91c1c",
            border: `1px solid ${isActive ? "#bbf7d0" : "#fecaca"}`,
            padding: "2px 10px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: 500,
            display: "inline-block"
          }}>
            {isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        width: 110,
        fixed: "right",
        align: "center",
        render: (_: any, record: EmployeeDto) => (
          <Space size={6}>
            <Tooltip title="View Details">
              <Button
                type="text"
                icon={<EyeOutlined />}
                size="small"
                onClick={() => {
                  setSelectedUser(record);
                  setIsDetailModalOpen(true);
                }}
                style={{ background: "#f8fafc", borderRadius: "6px", width: 30, height: 30, color: "#3b82f6" }}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => handleDelete(record.id)}
                style={{ background: "#fef2f2", borderRadius: "6px", width: 30, height: 30 }}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [handleDelete]
  );

  return (
    <div style={{ padding: "28px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        
        {/* Modern Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>User & Employee Management</Title>
            <Text type="secondary" style={{ fontSize: "14px" }}>Manage employee directories, organizational roles, and user access parameters.</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            style={{ borderRadius: "10px", paddingLeft: 22, paddingRight: 22, height: "42px", fontWeight: 500, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)" }}
            onClick={() => navigate("/users/add")}
          >
            Add User
          </Button>
        </div>

        <Card
          bordered={false}
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)",
          }}
          bodyStyle={{ padding: "24px" }}
        >
          {/* Advanced Search & Filter Toolbox */}
          <div style={{
            background: "#f8fafc",
            padding: "18px 20px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            marginBottom: "20px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <FilterOutlined style={{ color: "#3b82f6" }} />
              <Text strong style={{ color: "#334155", fontSize: "14px" }}>Filter & Search Parameters</Text>
            </div>
            
            <Row gutter={[12, 12]} align="middle">
              <Col xs={24} sm={16} md={10}>
                <Input
                  allowClear
                  size="large"
                  prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                  placeholder="Search by name, code, email, department..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ borderRadius: "8px", background: "#fff" }}
                />
              </Col>
              
              <Col xs={24} sm={8} md={10}>
                <Select
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Filter by Role Code"
                  allowClear
                  showSearch
                  value={selectedRoleFilter}
                  onChange={(value) => setSelectedRoleFilter(value)}
                  options={roleOptions}
                  optionFilterProp="label"
                />
              </Col>

              <Col xs={24} sm={24} md={4}>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={() => { setSearchText(""); setSelectedRoleFilter(undefined); }}
                  size="large"
                  style={{ width: "100%", borderRadius: "8px", background: "#fff", color: "#64748b", fontWeight: 500 }}
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </div>

          {/* Table Counter Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingInline: 4 }}>
            <Text type="secondary" style={{ fontSize: "13px" }}>
              Showing <Text strong>{filteredUsers.length}</Text> {filteredUsers.length === 1 ? "user" : "users"}
            </Text>
          </div>

          {/* Table */}
          <Table<EmployeeDto>
            dataSource={filteredUsers}
            columns={columns}
            rowKey="id"
            loading={loading}
            bordered={false}
            size="middle"
            scroll={{ x: 1000 }}
            pagination={{ 
              pageSize: 10, 
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
            }}
          />
        </Card>

        {/* DETAIL MODAL */}
        <Modal
          title={
            <div style={{ fontSize: "18px", fontWeight: 600, color: "#0f172a", paddingBottom: 4 }}>
              User Profile Details
            </div>
          }
          open={isDetailModalOpen}
          onCancel={() => setIsDetailModalOpen(false)}
          footer={[
            <Button 
              key="close" 
              type="primary" 
              size="large"
              onClick={() => setIsDetailModalOpen(false)}
              style={{ borderRadius: "8px", paddingInline: 24, fontWeight: 500 }}
            >
              Close
            </Button>
          ]}
          width={520}
          centered
          styles={{ body: { paddingTop: 12 } }}
        >
          {selectedUser && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
                <Avatar 
  size={64} 
  src={selectedUser.profileImageUrl}
  style={{ backgroundColor: "#3b82f6", fontWeight: 700, fontSize: "24px" }}
>
  {!selectedUser.profileImageUrl && (selectedUser.fullName ? selectedUser.fullName.charAt(0).toUpperCase() : <UserOutlined />)}
</Avatar>
                <div>
                  <Text strong style={{ fontSize: "18px", color: "#0f172a", display: "block" }}>{selectedUser.fullName || "-"}</Text>
                  <Text type="secondary" style={{ fontSize: "13px" }}>{selectedUser.email || "-"}</Text>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <div>
                  <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>Employee Code</Text>
                  <Text strong style={{ color: "#1e293b", fontFamily: "monospace" }}>{selectedUser.employeeCode || "-"}</Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>Company</Text>
                  <Text strong style={{ color: "#1e293b" }}>{selectedUser.companyName || "-"}</Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>Department</Text>
                  <Text strong style={{ color: "#1e293b" }}>{selectedUser.departmentName || "-"}</Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>Role</Text>
                  <Text strong style={{ color: "#1e293b" }}>{selectedUser.roleName} ({selectedUser.roleCode})</Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>Phone Number</Text>
                  <Text strong style={{ color: "#1e293b" }}>{selectedUser.phone || "-"}</Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>Joined Date</Text>
                  <Text strong style={{ color: "#1e293b" }}>{selectedUser.joinedDate ? new Date(selectedUser.joinedDate).toLocaleDateString("en-IN") : "-"}</Text>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>Location</Text>
                  <Text strong style={{ color: "#1e293b" }}>
                    {[selectedUser.cityName, selectedUser.stateName, selectedUser.countryName].filter(Boolean).join(", ") || "-"}
                  </Text>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}