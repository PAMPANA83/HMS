import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Card, Input, Space, message, Typography, Select, Row, Col, Tooltip, Popconfirm } from "antd";
import { SearchOutlined, ReloadOutlined, PlusOutlined, FilterOutlined, EditOutlined, DeleteOutlined, MedicineBoxOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table/interface";
import { useNavigate } from "react-router-dom";
import { DoctorDto } from "../models/Doctor.dto";
import { getDoctors, deleteDoctor } from "../services/Doctor.service";

const { Title, Text } = Typography;

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
      message.error("Failed to load doctor records.");
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
      message.success("Doctor record deleted successfully");
      fetchDoctors();
    } catch (error) {
      console.error("Delete doctor error:", error);
      message.error("Delete failed");
    }
  };

  const columns: ColumnsType<DoctorDto> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      fixed: "left",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Doctor Name",
      dataIndex: "doctorName",
      key: "doctorName",
      width: 220,
      fixed: "left",
      ellipsis: true,
      sorter: (a, b) => (a.doctorName || "").localeCompare(b.doctorName || ""),
      render: (text: string) => (
        <Space size={8}>
          <MedicineBoxOutlined style={{ color: "#3b82f6" }} />
          <Text strong style={{ color: "#1e293b" }}>{text || "—"}</Text>
        </Space>
      ),
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      key: "specialization",
      width: 180,
      ellipsis: true,
      render: (text: string) => (
        <span style={{ color: "#334155", fontWeight: 500 }}>
          {text || "—"}
        </span>
      ),
    },
    {
      title: "License No.",
      dataIndex: "licenseNumber",
      key: "licenseNumber",
      width: 150,
      render: (value: string) => (
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
          {value || "—"}
        </span>
      ),
    },
    {
      title: "Branch",
      dataIndex: "branchName",
      key: "branchName",
      width: 160,
      render: (text: string, record) => text || (record.branchId ? `Branch #${record.branchId}` : "—"),
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      key: "departmentName",
      width: 160,
      render: (text: string, record) => text || (record.departmentId ? `Dept #${record.departmentId}` : "—"),
    },
    {
  title: "Consultation Fee",
  dataIndex: "consultationFee",
  key: "consultationFee",
  width: 160,
  align: "right",
  sorter: (a, b) => (a.consultationFee || 0) - (b.consultationFee || 0),
  render: (fee: number | undefined) => {
    const formattedFee =
      fee !== undefined && fee !== null
        ? new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
          }).format(fee)
        : "—";

    return (
      <Text strong style={{ color: "#0f172a", fontFamily: "monospace" }}>
        {formattedFee}
      </Text>
    );
  },
},
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      align: "center",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "success" : "error"} style={{ borderRadius: "6px", paddingInline: "8px" }}>
          {isActive ? "ACTIVE" : "INACTIVE"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right",
      align: "center",
      render: (_, record: DoctorDto) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#3b82f6" }} />}
              size="small"
              onClick={() => handleEdit(record)}
              style={{ background: "#eff6ff", borderRadius: "6px", width: 30, height: 30 }}
            />
          </Tooltip>

          <Popconfirm
            title="Delete Doctor Profile"
            description="Are you sure you want to delete this doctor?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
                style={{ background: "#fef2f2", borderRadius: "6px", width: 30, height: 30 }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
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
    <div style={{ padding: "28px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        
        {/* Modern Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>Doctor Master</Title>
            <Text type="secondary" style={{ fontSize: "14px" }}>Manage doctor profiles, medical licenses, consultation fees, and branch assignments.</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            style={{ borderRadius: "10px", paddingLeft: 22, paddingRight: 22, height: "42px", fontWeight: 500, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)" }}
            onClick={() => navigate("/doctor/add")}
          >
            Add New
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
              <Col xs={24} sm={12} md={8}>
                <Input
                  allowClear
                  size="large"
                  prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                  placeholder="Global Search (Name, License, Dept, Branch...)"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ borderRadius: "8px", background: "#fff" }}
                />
              </Col>
              
              <Col xs={24} sm={12} md={5}>
                <Select
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Filter by Branch"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  value={selectedBranchFilter}
                  onChange={(value) => setSelectedBranchFilter(value)}
                  options={branchOptions}
                />
              </Col>

              <Col xs={24} sm={12} md={5}>
                <Select
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Filter by Department"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  value={selectedDeptFilter}
                  onChange={(value) => setSelectedDeptFilter(value)}
                  options={departmentOptions}
                />
              </Col>

              <Col xs={24} sm={12} md={3}>
                <Select
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Status"
                  allowClear
                  value={selectedStatusFilter}
                  onChange={(value) => setSelectedStatusFilter(value)}
                  options={[
                    { value: true, label: "Active" },
                    { value: false, label: "Inactive" },
                  ]}
                />
              </Col>

              <Col xs={24} sm={12} md={3}>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleResetAll}
                  loading={loading}
                  size="large"
                  style={{ width: "100%", borderRadius: "8px", background: "#fff", color: "#64748b", fontWeight: 500 }}
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </div>

          {/* Table Header Counter Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingInline: 4 }}>
            <Text type="secondary" style={{ fontSize: "13px" }}>
              Showing <Text strong>{filteredData.length}</Text> entries
            </Text>
          </div>

          {/* Modern Table Component */}
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={filteredData}
            bordered={false}
            size="middle"
            scroll={{ x: 1300 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} doctors`,
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default Doctor;