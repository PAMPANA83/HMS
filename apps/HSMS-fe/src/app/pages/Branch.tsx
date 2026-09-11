import { Table, Card, Button, Input, Tag, message, Typography, Space, Select, Row, Col, Tooltip, Popconfirm } from "antd";
import type { TableProps } from "antd";
import { useEffect, useMemo, useState } from "react";
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

const { Title, Text } = Typography;

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
      message.error("Failed to load branches");
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
      message.success("Branch deleted successfully");
      loadBranches();
    } catch (error) {
      console.error("Delete branch error:", error);
      message.error("Delete failed");
    }
  };

  // Batch Delete
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    try {
      setBatchDeleteLoading(true);
      await Promise.all(selectedRowKeys.map((id) => deleteBranch(Number(id))));
      message.success(`Successfully deleted ${selectedRowKeys.length} branches`);
      setSelectedRowKeys([]);
      await loadBranches();
    } catch (error: any) {
      console.error("Batch delete error:", error);
      message.error("Failed to delete selected branches");
    } finally {
      setBatchDeleteLoading(false);
    }
  };

  // Table Columns
  const columns: TableProps<BranchMastersDto>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      fixed: "left",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Branch Name",
      dataIndex: "branchName",
      key: "branchName",
      width: 220,
      fixed: "left",
      ellipsis: true,
      sorter: (a, b) => (a.branchName || "").localeCompare(b.branchName || ""),
      render: (text: string) => (
        <Space size={8}>
          <EnvironmentOutlined style={{ color: "#3b82f6" }} />
          <Text strong style={{ color: "#1e293b" }}>{text || "-"}</Text>
        </Space>
      ),
    },
    {
      title: "Branch Code",
      dataIndex: "branchCode",
      key: "branchCode",
      width: 140,
      sorter: (a, b) => (a.branchCode || "").localeCompare(b.branchCode || ""),
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
          {value || "-"}
        </span>
      ),
    },
    {
      title: "Company",
      dataIndex: "companyName",
      key: "companyName",
      width: 200,
      ellipsis: true,
      sorter: (a, b) => (a.companyName || "").localeCompare(b.companyName || ""),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Address",
      dataIndex: "addressLine1",
      key: "addressLine1",
      width: 230,
      ellipsis: true,
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
      title: "Country",
      dataIndex: "countryName",
      key: "countryName",
      width: 130,
    },
    {
      title: "Postal Code",
      dataIndex: "postalCode",
      key: "postalCode",
      width: 120,
    },
    {
      title: "Main Branch",
      dataIndex: "isMainBranch",
      key: "isMainBranch",
      width: 130,
      align: "center",
      render: (value: boolean) => (
        <Tag color={value ? "blue" : "default"} style={{ borderRadius: "6px", paddingInline: "8px" }}>
          {value ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      align: "center",
      render: (value: boolean) => (
        <Tag color={value ? "success" : "error"} style={{ borderRadius: "6px", paddingInline: "8px" }}>
          {value ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (value: string) => (value ? new Date(value).toLocaleDateString("en-IN") : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right",
      align: "center",
      render: (_: unknown, record: BranchMastersDto) => (
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
            title="Delete Branch"
            description="Are you sure you want to delete this branch?"
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

  return (
    <div style={{ padding: "28px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        
        {/* Modern Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>Branch Management</Title>
            <Text type="secondary" style={{ fontSize: "14px" }}>Configure and monitor corporate organization locations effortlessly.</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            style={{ borderRadius: "10px", paddingLeft: 22, paddingRight: 22, height: "42px", fontWeight: 500, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)" }}
            onClick={() => navigate("/Branch/Add")}
          >
            Add Branch
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
              <Col xs={24} sm={12} md={10}>
                <Input
                  allowClear
                  size="large"
                  prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                  placeholder="Search branch, company, city, state..."
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
                  placeholder="Filter by Status"
                  allowClear
                  value={selectedStatusFilter}
                  onChange={(value) => setSelectedStatusFilter(value)}
                  options={[
                    { value: true, label: "Active" },
                    { value: false, label: "Inactive" },
                  ]}
                />
              </Col>

              <Col xs={24} sm={12} md={4}>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={() => { 
                    setSearchText(""); 
                    setSelectedCityFilter(undefined); 
                    setSelectedStatusFilter(undefined); 
                  }}
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
                description={`Are you sure you want to delete ${selectedRowKeys.length} branches?`}
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

          {/* Table Component */}
          <Table<BranchMastersDto>
            rowKey="id"
            loading={loading}
            dataSource={filteredData}
            columns={columns}
            bordered={false}
            size="middle"
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
            scroll={{
              x: 1800,
            }}
            pagination={{
              defaultPageSize: 5,
              pageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50", "100"],
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} branches`,
            }}
          />
        </Card>
      </div>
    </div>
  );
}