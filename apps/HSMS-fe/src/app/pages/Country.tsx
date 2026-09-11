import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  message,
  Typography,
  Space,
  Select,
  Row,
  Col,
  Tooltip,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";

import {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
} from "../services/country.service";

import {
  CountryMastersDto,
  CountryDto,
} from "../models/country.dto";

import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  GlobalOutlined,
  FilterOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export function Country() {
  const [data, setData] = useState<CountryMastersDto[]>([]);
  const [form] = Form.useForm();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CountryMastersDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Search & Filters
  const [searchText, setSearchText] = useState("");
  const [selectedIsoFilter, setSelectedIsoFilter] = useState<string | undefined>(undefined);

  // Table selection
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Load Countries
  const loadCountries = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getCountries();
      const countries = result.data || result || [];
      setData(countries);
    } catch (error) {
      console.error("Load countries failed:", error);
      message.error("Failed to load countries");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  // Unique ISO Code options for filter dropdown
  const isoOptions = useMemo(() => {
    return Array.from(
      new Set(data.map((item) => item.isoCode).filter(Boolean))
    ).map((code) => ({
      value: code,
      label: code,
    }));
  }, [data]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = useCallback((record: CountryMastersDto) => {
    setEditingRecord(record);
    form.setFieldsValue({
      countryName: record.name,
      isoCode: record.isoCode,
      phoneCode: record.phoneCode,
    });
    setIsModalOpen(true);
  }, [form]);

  // Handle Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  // Create or Update Form Handler
  const handleFormSubmit = async (values: {
    countryName: string;
    isoCode: string;
    phoneCode: string;
  }) => {
    try {
      setSubmitting(true);
      const countryData: CountryDto = {
        name: values.countryName.trim(),
        isoCode: values.isoCode.trim().toUpperCase(),
        phoneCode: values.phoneCode.trim(),
      };

      let result;
      if (editingRecord?.id) {
        result = await updateCountry({
          ...editingRecord,
          ...countryData,
          id: editingRecord.id,
        });
      } else {
        result = await createCountry(countryData);
      }

      if (result.success) {
        message.success(
          editingRecord
            ? "Country updated successfully"
            : "Country created successfully"
        );
        handleCloseModal();
        await loadCountries();
      } else {
        message.error(result.message || "Operation failed");
      }
    } catch (error: any) {
      message.error(error.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Single Country Confirm Box
  const handleDelete = useCallback((id: number) => {
    Modal.confirm({
      title: "Delete Country?",
      content: "Are you sure you want to delete this country? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const res = await deleteCountry(id);
          if (res.success) {
            message.success(res.message || "Country deleted successfully");
            setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
            await loadCountries();
          } else {
            message.error(res.message || "Delete failed");
          }
        } catch (error) {
          message.error("Delete failed");
        }
      },
    });
  }, [loadCountries]);

  // Multi / Bulk Delete Handler
  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) return;

    Modal.confirm({
      title: `Delete ${selectedRowKeys.length} selected country(ies)?`,
      icon: <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,
      content: "Are you sure you want to delete all selected countries? This action cannot be undone.",
      okText: "Delete All",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          setLoading(true);
          await Promise.all(
            selectedRowKeys.map((id) => deleteCountry(Number(id)))
          );
          message.success("Selected countries deleted successfully");
          setSelectedRowKeys([]);
          await loadCountries();
        } catch (error) {
          console.error("Bulk delete failed:", error);
          message.error("Failed to delete selected items");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Filtered Dataset
  const filteredData = useMemo(() => {
    const search = searchText.toLowerCase().trim();

    return data.filter((item) => {
      const matchesIso = selectedIsoFilter ? item.isoCode === selectedIsoFilter : true;
      const matchesSearch =
        !search ||
        [item.name, item.isoCode, item.phoneCode]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(search)
          );

      return matchesIso && matchesSearch;
    });
  }, [data, searchText, selectedIsoFilter]);

  // Table Columns Definition
  const columns: ColumnsType<CountryMastersDto> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      render: (text) => (
        <Space size={8}>
          <GlobalOutlined style={{ color: "#3b82f6" }} />
          <Text strong style={{ color: "#1e293b" }}>
            {text || "-"}
          </Text>
        </Space>
      ),
    },
    {
      title: "ISO Code",
      dataIndex: "isoCode",
      key: "isoCode",
      align: "center",
      sorter: (a, b) => (a.isoCode || "").localeCompare(b.isoCode || ""),
      render: (text) =>
        text ? (
          <Tag color="blue" style={{ borderRadius: "6px", fontFamily: "monospace", fontWeight: 600 }}>
            {text}
          </Tag>
        ) : (
          "-"
        ),
    },
    {
      title: "Phone Code",
      dataIndex: "phoneCode",
      key: "phoneCode",
      render: (text) => (
        <span style={{ fontFamily: "monospace", color: "#334155", fontWeight: 500 }}>
          {text || "-"}
        </span>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime(),
      render: (text) =>
        text
          ? new Date(text).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-",
    },
    {
      title: "Edited",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) => new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime(),
      render: (text) =>
        text
          ? new Date(text).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#2563eb" }} />}
              size="small"
              onClick={() => handleOpenEditModal(record)}
              style={{ background: "#eff6ff", borderRadius: "6px", width: 30, height: 30 }}
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
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div style={{ padding: "28px", background: "#f8fafc", minHeight: "100vh" }}>
      <style>{`
        /* Fix page-size / pagination dropdown clipping inside cards */
        .ant-card {
          overflow: visible !important;
        }
        .ant-select-dropdown {
          z-index: 1050 !important;
        }
        .custom-table .ant-table-wrapper {
          overflow: visible !important;
        }
        .custom-table .ant-table-container {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
        }
        .custom-table .ant-table-thead > tr > th {
          background-color: #f8fafc !important;
          color: #475569 !important;
          font-weight: 600 !important;
          font-size: 13px !important;
          border-bottom: 1px solid #e2e8f0 !important;
          padding: 14px 16px !important;
        }
        .custom-table .ant-table-tbody > tr > td {
          padding: 14px 16px !important;
          border-bottom: 1px solid #f1f5f9 !important;
          font-size: 14px !important;
        }
        .custom-table .ant-table-tbody > tr:hover > td {
          background-color: #f8fafc !important;
        }
      `}</style>

      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        {/* Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>
              Country Master
            </Title>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              Configure and manage global countries, ISO records, and calling codes.
            </Text>
          </div>

          <Space>
            {/* Multi-Delete Action Trigger */}
            {selectedRowKeys.length > 0 && (
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="large"
                style={{ borderRadius: "10px", height: "42px", fontWeight: 500 }}
                onClick={handleBulkDelete}
              >
                Delete Selected ({selectedRowKeys.length})
              </Button>
            )}

            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              style={{
                borderRadius: "10px",
                paddingLeft: 22,
                paddingRight: 22,
                height: "42px",
                fontWeight: 500,
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)",
              }}
              onClick={handleOpenCreateModal}
            >
              Add New
            </Button>
          </Space>
        </div>

        <Card
          bordered={false}
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)",
          }}
          bodyStyle={{ padding: "24px" }}
        >
          {/* Filter Bar */}
          <div
            style={{
              background: "#f8fafc",
              padding: "18px 20px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <FilterOutlined style={{ color: "#3b82f6" }} />
              <Text strong style={{ color: "#334155", fontSize: "14px" }}>
                Filter & Search Parameters
              </Text>
            </div>

            <Row gutter={[12, 12]} align="middle">
              <Col xs={24} sm={16} md={12}>
                <Input
                  allowClear
                  size="large"
                  prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
                  placeholder="Search country, ISO code, phone code..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ borderRadius: "8px", background: "#fff" }}
                />
              </Col>

              <Col xs={24} sm={8} md={8}>
                <Select
                  style={{ width: "100%" }}
                  size="large"
                  placeholder="Filter by ISO Code"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  value={selectedIsoFilter}
                  onChange={(value) => setSelectedIsoFilter(value)}
                  options={isoOptions}
                />
              </Col>

              <Col xs={24} sm={24} md={4}>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setSearchText("");
                    setSelectedIsoFilter(undefined);
                  }}
                  size="large"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    background: "#fff",
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </div>

          {/* Selection Status Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingInline: 4 }}>
            <Text type="secondary" style={{ fontSize: "13px" }}>
              Showing <Text strong>{filteredData.length}</Text> countries
            </Text>
            {selectedRowKeys.length > 0 && (
              <Text style={{ fontSize: "13px", color: "#2563eb", fontWeight: 500 }}>
                {selectedRowKeys.length} country(ies) selected
              </Text>
            )}
          </div>

          {/* Table */}
          <Table
            className="custom-table"
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            loading={loading}
            rowSelection={rowSelection}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            }}
            scroll={{ x: "max-content" }}
          />
        </Card>

        {/* Dynamic Modal for Create / Edit */}
        <Modal
          title={
            <div style={{ fontSize: "18px", fontWeight: 600, color: "#0f172a", paddingBottom: 4 }}>
              {editingRecord ? "Edit Country" : "Create Country"}
            </div>
          }
          open={isModalOpen}
          footer={null}
          width={480}
          centered
          styles={{ body: { paddingTop: 8 } }}
          onCancel={handleCloseModal}
        >
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item
              label={<Text strong style={{ color: "#334155" }}>Country Name</Text>}
              name="countryName"
              rules={[{ required: true, message: "Enter country name" }]}
            >
              <Input size="large" placeholder="e.g. India" style={{ borderRadius: "8px" }} />
            </Form.Item>

            <Form.Item
              label={<Text strong style={{ color: "#334155" }}>ISO Code</Text>}
              name="isoCode"
              rules={[
                { required: true, message: "Enter ISO code" },
                { min: 2, max: 3, message: "ISO code must be 2 or 3 characters" },
              ]}
            >
              <Input
                size="large"
                placeholder="e.g. IND"
                maxLength={3}
                style={{ borderRadius: "8px", textTransform: "uppercase", fontFamily: "monospace" }}
              />
            </Form.Item>

            <Form.Item
              label={<Text strong style={{ color: "#334155" }}>Phone Code</Text>}
              name="phoneCode"
              rules={[{ required: true, message: "Enter phone code" }]}
            >
              <Input size="large" placeholder="e.g. +91" style={{ borderRadius: "8px", fontFamily: "monospace" }} />
            </Form.Item>

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={submitting}
                style={{ flex: 1, borderRadius: "8px", fontWeight: 500, height: "42px" }}
              >
                {editingRecord ? "Update" : "Create"}
              </Button>

              <Button
                size="large"
                onClick={handleCloseModal}
                style={{ flex: 1, borderRadius: "8px", fontWeight: 500, height: "42px" }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
}