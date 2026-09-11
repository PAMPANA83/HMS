import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Card, Input, Space, message, Typography, Select, Row, Col, Tooltip, Popconfirm } from "antd";
import { SearchOutlined, ReloadOutlined, PlusOutlined, BankOutlined, FilterOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table/interface";
import { useNavigate } from "react-router-dom";
import { CompanyMastersDto } from "../models/Company.dto";
import { getCompany } from "../services/Company.service";
// If you have a delete service, import it here:
// import { deleteCompany } from "../services/Company.service";

const { Title, Text } = Typography;

export const Company: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<CompanyMastersDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCityFilter, setSelectedCityFilter] = useState<string | undefined>(undefined);
  const [selectedStateFilter, setSelectedStateFilter] = useState<string | undefined>(undefined);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<boolean | undefined>(undefined);

  // Multi-select & Batch Delete States
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [batchDeleteLoading, setBatchDeleteLoading] = useState(false);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await getCompany();
      const companyList = Array.isArray(response) ? response : response?.data || [];
      setData(companyList);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      message.error("Failed to load company records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Dropdown options for custom filter toolbar
  const cityOptions = Array.from(new Set(data.map((d) => d.cityName).filter(Boolean))).map((city) => ({
    value: city,
    label: city,
  }));

  const stateOptions = Array.from(new Set(data.map((d) => d.stateName).filter(Boolean))).map((state) => ({
    value: state,
    label: state,
  }));

  // Edit handler placeholder
  const handleEdit = (record: CompanyMastersDto) => {
    console.log("Edit Company:", record);
    // navigate(`/company/edit/${record.id}`);
  };

  // Delete handler placeholder
  const handleDelete = async (id: number) => {
    try {
      // await deleteCompany(id);
      message.success("Company deleted successfully");
      fetchCompanies();
    } catch (error) {
      console.error("Delete company error:", error);
      message.error("Delete failed");
    }
  };

  // Batch Delete handler
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    try {
      setBatchDeleteLoading(true);
      // await Promise.all(selectedRowKeys.map((id) => deleteCompany(Number(id))));
      message.success(`Successfully deleted ${selectedRowKeys.length} companies`);
      setSelectedRowKeys([]);
      await fetchCompanies();
    } catch (error: any) {
      console.error("Batch delete error:", error);
      message.error("Failed to delete selected companies");
    } finally {
      setBatchDeleteLoading(false);
    }
  };

  const columns: ColumnsType<CompanyMastersDto> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      fixed: "left",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Company Name",
      dataIndex: "companyname",
      key: "companyname",
      width: 240,
      fixed: "left",
      ellipsis: true,
      sorter: (a, b) => (a.companyname || "").localeCompare(b.companyname || ""),
      render: (text: string, record: CompanyMastersDto) => (
        <Space size={8}>
          <BankOutlined style={{ color: "#3b82f6" }} />
          <Text strong style={{ color: "#1e293b" }}>{text || record.companyname || "—"}</Text>
        </Space>
      ),
    },
    {
      title: "Reg. No",
      dataIndex: "registrationNumber",
      key: "registrationNumber",
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
      title: "GSTIN",
      dataIndex: "gstin",
      key: "gstin",
      width: 160,
      render: (value: string) => (
        <span style={{ fontFamily: "monospace", color: "#334155", fontWeight: 500 }}>
          {value || "—"}
        </span>
      ),
    },
    {
      title: "PAN",
      dataIndex: "panNumber",
      key: "panNumber",
      width: 130,
      render: (value: string) => (
        <span style={{ fontFamily: "monospace", color: "#334155", fontWeight: 500 }}>
          {value || "—"}
        </span>
      ),
    },
    {
      title: "Contact Info",
      key: "contact",
      width: 220,
      render: (_, record) => (
        <div>
          <div style={{ color: "#1e293b", fontWeight: 500 }}>{record.email || "—"}</div>
          <div style={{ color: "#64748b", fontSize: "12px" }}>{record.phone || "—"}</div>
        </div>
      ),
    },
    {
      title: "City",
      dataIndex: "cityName",
      key: "cityName",
      width: 140,
    },
    {
      title: "State",
      dataIndex: "stateName",
      key: "stateName",
      width: 140,
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
      render: (_, record: CompanyMastersDto) => (
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
            title="Delete Company"
            description="Are you sure you want to delete this company?"
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

  const filteredData = data.filter((company) => {
    const matchesCity = selectedCityFilter ? company.cityName === selectedCityFilter : true;
    const matchesState = selectedStateFilter ? company.stateName === selectedStateFilter : true;
    const matchesStatus = selectedStatusFilter !== undefined ? company.isActive === selectedStatusFilter : true;

    const search = searchText.trim().toLowerCase();
    const matchesSearch = !search || [
      company.name,
      company.companyname,
      company.registrationNumber,
      company.gstin,
      company.panNumber,
      company.email,
      company.phone,
      company.cityName,
      company.stateName,
    ]
      .filter(Boolean)
      .some((val) => String(val).toLowerCase().includes(search));

    return matchesCity && matchesState && matchesStatus && matchesSearch;
  });

  const handleResetAll = () => {
    setSearchText("");
    setSelectedCityFilter(undefined);
    setSelectedStateFilter(undefined);
    setSelectedStatusFilter(undefined);
    setSelectedRowKeys([]);
    fetchCompanies();
  };

  return (
    <div style={{ padding: "28px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        
        {/* Modern Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>Company Master</Title>
            <Text type="secondary" style={{ fontSize: "14px" }}>Manage registered corporate entities, tax details, and statuses.</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            style={{ borderRadius: "10px", paddingLeft: 22, paddingRight: 22, height: "42px", fontWeight: 500, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)" }}
            onClick={() => navigate("/company/add")}
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
                  placeholder="Global Search (Name, GST, PAN, Email...)"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ borderRadius: "8px", background: "#fff" }}
                />
              </Col>
              
              <Col xs={24} sm={12} md={5}>
                <Select
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Filter by City"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  value={selectedCityFilter}
                  onChange={(value) => setSelectedCityFilter(value)}
                  options={cityOptions}
                />
              </Col>

              <Col xs={24} sm={12} md={5}>
                <Select
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Filter by State"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  value={selectedStateFilter}
                  onChange={(value) => setSelectedStateFilter(value)}
                  options={stateOptions}
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

          {/* Batch Delete Action Banner */}
          {selectedRowKeys.length > 0 && (
            <div style={{ 
              display: "flex", justifyContent: "space-between", alignItems: "center", 
              background: "#eff6ff", border: "1px solid #bfdbfe", padding: "10px 16px", 
              borderRadius: "8px", marginBottom: "16px" 
            }}>
              <Text style={{ color: "#1e40af", fontWeight: 500 }}>
                Selected <strong>{selectedRowKeys.length}</strong> items
              </Text>
              <Popconfirm
                title="Batch Delete"
                description={`Are you sure you want to delete ${selectedRowKeys.length} companies?`}
                onConfirm={handleBatchDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button 
                  danger 
                  type="primary" 
                  icon={<DeleteOutlined />} 
                  loading={batchDeleteLoading}
                  size="middle"
                >
                  Delete Selected
                </Button>
              </Popconfirm>
            </div>
          )}

          {/* Table Header Counter Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingInline: 4 }}>
            <Text type="secondary" style={{ fontSize: "13px" }}>
              Showing <Text strong>{filteredData.length}</Text> entries
            </Text>
          </div>

          {/* Modern Table Component */}
          <Table<CompanyMastersDto>
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={filteredData}
            bordered={false}
            size="middle"
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
            scroll={{ x: 1300 }}
            pagination={{
              defaultPageSize: 5,
              pageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50", "100"],
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} companies`,
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default Company;