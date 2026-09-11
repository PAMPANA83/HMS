import { Card, Button, Table, Space, Popconfirm, Modal, Form, Input, Select, message, Row, Col, Typography, Tooltip } from "antd";
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

const { Title, Text } = Typography;

interface BranchOption {
  id?: number; 
  branchName?: string;
}

const extractDataArray = <T,>(result: any): T[] => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.data?.data)) return result.data.data;
  return [];
};

export function Departments() {
  const [form] = Form.useForm<CreateDepartmentDto>();

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

  const loadDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getDepartment();
      const data = extractDataArray<DepartmentDto>(response);
      setDepartments(data);
    } catch (error) {
      console.error("Failed to load departments:", error);
      message.error("Failed to load departments");
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
      message.error("Failed to load branches");
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
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record: DepartmentDto) => {
    setEditingDepartment(record);
    form.setFieldsValue({
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
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);

      const payload: CreateDepartmentDto = {
        branchId: Number(values.branchId),
        name: values.name?.trim() || "",
        code: values.code?.trim().toUpperCase() || "",
      };

      if (editingDepartment?.id) {
        await updateDepartment(editingDepartment.id, payload as unknown as DepartmentDto);
        message.success("Department updated successfully");
      } else {
        await createDepartment(payload as unknown as DepartmentDto);
        message.success("Department created successfully");
      }

      setIsModalOpen(false);
      setEditingDepartment(null);
      form.resetFields();
      await loadDepartments();
    } catch (error: any) {
      console.error("Submit error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        "Operation failed";
      message.error(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDepartment(id);
      message.success("Department deleted successfully");
      await loadDepartments();
    } catch (error: any) {
      console.error("Delete error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to delete department";
      message.error(errorMessage);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    try {
      setBatchDeleteLoading(true);
      await Promise.all(selectedRowKeys.map((id) => deleteDepartment(Number(id))));
      message.success(`Successfully deleted ${selectedRowKeys.length} departments`);
      setSelectedRowKeys([]);
      await loadDepartments();
    } catch (error: any) {
      console.error("Batch delete error:", error);
      message.error("Failed to delete selected departments");
    } finally {
      setBatchDeleteLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Branch Name",
      dataIndex: "branchName",
      key: "branchName",
      render: (text: string) => (
        <Space>
          <ApartmentOutlined style={{ color: "#3b82f6" }} />
          <Text strong style={{ color: "#334155" }}>{text || "—"}</Text>
        </Space>
      ),
    },
    {
      title: "Department Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text style={{ color: "#1e293b", fontWeight: 500 }}>{text}</Text>,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (value: string) => (
        <span style={{ 
          background: "#f1f5f9", 
          padding: "2px 8px", 
          borderRadius: "6px", 
          border: "1px solid #e2e8f0", 
          fontFamily: "monospace",
          fontWeight: 600,
          color: "#475569"
        }}>
          {value?.toUpperCase()}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center" as const,
      render: (_: any, record: DepartmentDto) => (
        <Space size="small">
          <Tooltip title="Edit Department">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#3b82f6" }} />}
              onClick={() => handleOpenEditModal(record)}
              style={{ background: "#eff6ff", borderRadius: "6px" }}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Department"
            description="Are you sure you want to delete this department?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Department">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                style={{ background: "#fef2f2", borderRadius: "6px" }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        {/* Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 600, color: "#1e293b" }}>Departments Management</Title>
            <Text type="secondary">Manage internal departments, codes, and operational branch mappings.</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            style={{ borderRadius: "8px", paddingLeft: 20, paddingRight: 20, boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)" }}
            onClick={handleOpenAddModal}
          >
            Add Department
          </Button>
        </div>

        <Card
          bordered={false}
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
          }}
          bodyStyle={{ padding: "24px" }}
        >
          {/* MODERN FILTER BAR */}
          <div style={{
            background: "#f8fafc",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            marginBottom: "20px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <FilterOutlined style={{ color: "#3b82f6" }} />
              <Text strong style={{ color: "#334155", fontSize: "14px" }}>Filter & Search</Text>
            </div>
            
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12} md={10}>
                <Input
                  placeholder="Search by name, code, or branch..."
                  prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Col>
              <Col xs={24} sm={12} md={10}>
                <Select
                  style={{ width: '100%', borderRadius: '8px' }}
                  placeholder="Filter by Branch"
                  allowClear
                  showSearch
                  size="large"
                  optionFilterProp="label"
                  loading={branchLoading}
                  value={selectedBranchFilter}
                  onChange={(value) => setSelectedBranchFilter(value)}
                  options={branches.map((branch) => ({
                    value: branch.id,
                    label: branch.branchName,
                  }))}
                />
              </Col>
              <Col xs={24} sm={24} md={4} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={() => { setSearchText(""); setSelectedBranchFilter(undefined); }}
                  size="large"
                  style={{ width: "100%", borderRadius: "8px", background: "#fff" }}
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
                description={`Are you sure you want to delete ${selectedRowKeys.length} departments?`}
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

          <Table
            dataSource={filteredDepartments}
            columns={columns}
            rowKey="id"
            loading={loading}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
            pagination={{
              defaultPageSize: 5,
              pageSizeOptions: ['5', '10', '20', '50', '100'],
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} departments`,
            }}
          />

          <Modal
            title={<Text strong style={{ fontSize: "16px", color: "#1e293b" }}>{editingDepartment ? "Edit Department" : "Create Department"}</Text>}
            open={isModalOpen}
            onOk={handleSubmit}
            onCancel={handleCloseModal}
            confirmLoading={submitLoading}
            okText={editingDepartment ? "Update Department" : "Create Department"}
            cancelText="Cancel"
            destroyOnClose
            centered
            okButtonProps={{ style: { borderRadius: "6px" } }}
            cancelButtonProps={{ style: { borderRadius: "6px" } }}
          >
            <Form form={form} layout="vertical" autoComplete="off" style={{ marginTop: 16 }}>
              <Form.Item
                label="Branch"
                name="branchId"
                rules={[{ required: true, message: "Please select branch" }]}
              >
                <Select
                  showSearch
                  allowClear
                  size="large"
                  placeholder={branchLoading ? "Loading branches..." : "Select Branch"}
                  loading={branchLoading}
                  optionFilterProp="label"
                  options={branches.map((branch) => ({
                    value: branch.id,
                    label: branch.branchName,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="Department Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter department name" },
                  { min: 2, message: "Department name must be at least 2 characters" },
                ]}
              >
                <Input placeholder="Cardiology" size="large" />
              </Form.Item>

              <Form.Item
                label="Department Code"
                name="code"
                rules={[
                  { required: true, message: "Please enter department code" },
                  { min: 2, max: 10, message: "Department code must be between 2 and 10 characters" },
                ]}
              >
                <Input
                  placeholder="CARD"
                  maxLength={10}
                  size="large"
                  style={{ textTransform: "uppercase" }}
                  onChange={(e) => {
                    form.setFieldValue("code", e.target.value.toUpperCase());
                  }}
                />
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </div>
    </div>
  );
}