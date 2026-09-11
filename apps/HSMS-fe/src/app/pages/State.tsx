import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
  Tag,
  Typography,
  Space,
  Row,
  Col,
  Tooltip,
} from "antd";
import type { TableProps } from "antd";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  EnvironmentOutlined,
  FilterOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import {
  getState,
  createstate,
  deleteState,
} from "../services/State.service";
import { getCountries } from "../services/country.service";
import {
  StateMastersDto,
  CreateStateMasters,
} from "../models/state.dto";

const { Title, Text } = Typography;

interface FormValues {
  name: string;
  stateCode: string;
  countryID: number;
}

export function State() {
  const [data, setData] = useState<StateMastersDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search & Filters
  const [searchText, setSearchText] = useState("");
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string | undefined>(undefined);

  // Row Selection Keys for Bulk Actions
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Pagination State
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [countries, setCountries] = useState<
    { id: number; countryName?: string; name?: string }[]
  >([]);

  const [form] = Form.useForm<FormValues>();

  // ==============================
  // Load Data Callbacks
  // ==============================

  const loadStates = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getState();
      setData(Array.isArray(result) ? result : result?.data || []);
    } catch (error) {
      console.error("Load states failed:", error);
      message.error("Failed to load states");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCountries = useCallback(async () => {
    try {
      const countriesResult = await getCountries();
      const countriesData =
        countriesResult?.data || countriesResult || [];
      setCountries(countriesData);
    } catch (error) {
      console.error("Load countries failed:", error);
      message.error("Failed to load countries");
    }
  }, []);

  useEffect(() => {
    loadCountries();
    loadStates();
  }, [loadCountries, loadStates]);

  // ==============================
  // Handlers
  // ==============================

  const handleCreate = async (values: FormValues) => {
    try {
      const payload: CreateStateMasters = {
        stateName: values.name.trim(),
        stateCode: String(values.stateCode).trim(),
        countryID: values.countryID,
      };

      await createstate(payload);
      message.success("State created successfully");
      form.resetFields();
      setIsModalOpen(false);
      await loadStates();
    } catch (error) {
      console.error("Create state failed:", error);
      message.error("Create failed");
    }
  };

  // Single Item Delete
  const handleDelete = useCallback(
    (id: number) => {
      Modal.confirm({
        title: "Delete State?",
        content: "This action cannot be undone.",
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            await deleteState(id);
            message.success("State deleted successfully");
            setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
            await loadStates();
          } catch (error) {
            console.error("Delete state failed:", error);
            message.error("Delete failed");
          }
        },
      });
    },
    [loadStates]
  );

  // Bulk / Multi Delete
  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) return;

    Modal.confirm({
      title: `Delete ${selectedRowKeys.length} selected state(s)?`,
      icon: <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,
      content: "Are you sure you want to delete these selected states? This action cannot be undone.",
      okText: "Delete All",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          setLoading(true);
          await Promise.all(selectedRowKeys.map((id) => deleteState(Number(id))));
          message.success("Selected states deleted successfully");
          setSelectedRowKeys([]);
          await loadStates();
        } catch (error) {
          console.error("Bulk delete failed:", error);
          message.error("Failed to delete selected states");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // ==============================
  // Filters & Dynamic Page Sizes
  // ==============================

  const countrySelectOptions = useMemo(
    () =>
      countries.map((c) => ({
        label: c.countryName || c.name,
        value: c.id,
      })),
    [countries]
  );

  const countryFilterOptions = useMemo(() => {
    return Array.from(
      new Set(
        data
          .map((item) => item.countryName)
          .filter(Boolean)
      )
    ).map((country) => ({
      value: country,
      label: country,
    }));
  }, [data]);

  const filteredData = useMemo(() => {
    const search = searchText.toLowerCase().trim();

    return data.filter((item) => {
      const matchesCountry = selectedCountryFilter ? item.countryName === selectedCountryFilter : true;
      const matchesSearch = !search || [
        item.name,
        item.stateCode,
        item.countryName,
      ]
        .filter((val) => val !== null && val !== undefined)
        .some((val) => String(val).toLowerCase().includes(search));

      return matchesCountry && matchesSearch;
    });
  }, [data, searchText, selectedCountryFilter]);

  const pageSizeOptions = useMemo(() => {
    const total = filteredData.length;
    const baseOptions = [10, 20, 50, 100];

    if (total > 0 && !baseOptions.includes(total)) {
      baseOptions.push(total);
    }

    return baseOptions
      .filter((size) => size <= Math.max(total, 10))
      .sort((a, b) => a - b)
      .map(String);
  }, [filteredData.length]);

  // ==============================
  // Columns & Selection Config
  // ==============================

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const columns: TableProps<StateMastersDto>["columns"] = useMemo(
    () => [
      {
        title: "State",
        dataIndex: "name",
        key: "name",
        width: 220,
        fixed: "left",
        ellipsis: true,
        sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
        render: (text: string) => (
          <Space size={8}>
            <EnvironmentOutlined style={{ color: "#3b82f6" }} />
            <Text strong style={{ color: "#1e293b" }}>{text || "-"}</Text>
          </Space>
        ),
      },
      {
        title: "Code",
        dataIndex: "stateCode",
        key: "stateCode",
        width: 140,
        align: "center",
        sorter: (a, b) => String(a.stateCode || "").localeCompare(String(b.stateCode || "")),
        render: (code: string | number) => (
          <span style={{ 
            background: "#eff6ff", 
            padding: "2px 8px", 
            borderRadius: "6px", 
            border: "1px solid #bfdbfe", 
            fontFamily: "monospace",
            fontWeight: 600,
            color: "#1d4ed8",
            fontSize: "12px"
          }}>
            {code ?? "-"}
          </span>
        ),
      },
      {
        title: "Country",
        dataIndex: "countryName",
        key: "countryName",
        width: 180,
        sorter: (a, b) =>
          (a.countryName || "").localeCompare(b.countryName || ""),
        render: (country: string) => (
          <Text style={{ color: "#334155", fontWeight: 500 }}>{country || "-"}</Text>
        ),
      },
      {
        title: "Created",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 150,
        sorter: (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        render: (date: string) =>
          date ? new Date(date).toLocaleDateString("en-IN") : "-",
      },
      {
        title: "Actions",
        key: "actions",
        width: 100,
        fixed: "right",
        align: "center",
        render: (_, record) => (
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
            <Title level={3} style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>State Master</Title>
            <Text type="secondary" style={{ fontSize: "14px" }}>Configure and manage administrative regions, state codes, and country mappings.</Text>
          </div>
          
          <Space>
            {/* Multi-Delete Action Button */}
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
              style={{ borderRadius: "10px", paddingLeft: 22, paddingRight: 22, height: "42px", fontWeight: 500, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)" }}
              onClick={() => {
                form.resetFields();
                setIsModalOpen(true);
              }}
            >
              Add State
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
              <Col xs={24} sm={16} md={12}>
                <Input
                  allowClear
                  size="large"
                  prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                  placeholder="Search state, code, country..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setPagination((prev) => ({ ...prev, current: 1 }));
                  }}
                  style={{ borderRadius: "8px", background: "#fff" }}
                />
              </Col>
              
              <Col xs={24} sm={8} md={8}>
                <Select
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Filter by Country"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  value={selectedCountryFilter}
                  onChange={(value) => {
                    setSelectedCountryFilter(value);
                    setPagination((prev) => ({ ...prev, current: 1 }));
                  }}
                  options={countryFilterOptions}
                />
              </Col>

              <Col xs={24} sm={24} md={4}>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={() => {
                    setSearchText("");
                    setSelectedCountryFilter(undefined);
                    setPagination({ current: 1, pageSize: 10 });
                  }}
                  size="large"
                  style={{ width: "100%", borderRadius: "8px", background: "#fff", color: "#64748b", fontWeight: 500 }}
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </div>

          {/* Table Counter & Multi Selection Status */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingInline: 4 }}>
            <Text type="secondary" style={{ fontSize: "13px" }}>
              Showing <Text strong>{filteredData.length}</Text> states
            </Text>
            {selectedRowKeys.length > 0 && (
              <Text style={{ fontSize: "13px", color: "#2563eb", fontWeight: 500 }}>
                {selectedRowKeys.length} state(s) selected
              </Text>
            )}
          </div>

          {/* State Table with Row Selection */}
          <Table<StateMastersDto>
            rowKey="id"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            bordered={false}
            size="middle"
            scroll={{ x: 900 }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              pageSizeOptions: pageSizeOptions,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} states`,
              onChange: (page, pageSize) => {
                setPagination({ current: page, pageSize });
              },
              onShowSizeChange: (current, size) => {
                setPagination({ current: 1, pageSize: size });
              },
            }}
          />
        </Card>

        {/* Create State Modal */}
        <Modal
          title={
            <div style={{ fontSize: "18px", fontWeight: 600, color: "#0f172a", paddingBottom: 4 }}>
              Create State
            </div>
          }
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
          }}
          footer={null}
          width={480}
          centered
          styles={{ body: { paddingTop: 8 } }}
        >
          <Form form={form} layout="vertical" onFinish={handleCreate}>
            <Form.Item
              label={<Text strong style={{ color: "#334155" }}>State Name</Text>}
              name="name"
              rules={[{ required: true, message: "Enter state name" }]}
            >
              <Input size="large" placeholder="e.g. Karnataka" style={{ borderRadius: "8px" }} />
            </Form.Item>

            <Form.Item
              label={<Text strong style={{ color: "#334155" }}>State Code</Text>}
              name="stateCode"
              rules={[{ required: true, message: "Enter state code" }]}
            >
              <Input 
                size="large"
                placeholder="e.g. KA" 
                maxLength={10} 
                allowClear 
                style={{ borderRadius: "8px", textTransform: "uppercase", fontFamily: "monospace" }}
              />
            </Form.Item>

            <Form.Item
              label={<Text strong style={{ color: "#334155" }}>Country</Text>}
              name="countryID"
              rules={[{ required: true, message: "Select country" }]}
            >
              <Select
                size="large"
                placeholder="Select country"
                showSearch
                optionFilterProp="label"
                allowClear
                options={countrySelectOptions}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ flex: 1, borderRadius: "8px", fontWeight: 500, height: "42px" }}
              >
                Create State
              </Button>
              <Button
                size="large"
                onClick={() => {
                  form.resetFields();
                  setIsModalOpen(false);
                }}
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