import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Typography,
  Space,
  Row,
  Col,
  Tooltip,
} from "antd";

import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import DataTable, { type TableColumn } from "react-data-table-component";

import {
  CityMastersDto,
  CreateCityDto,
} from "../models/City.dto";

import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  ShopOutlined,
  FilterOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import {
  deleteCity,
  getCity,
  createCity,
} from "../services/City.service";

import {
  getState,
} from "../services/State.service";

const { Title, Text } = Typography;

export function City() {
  const [data, setData] = useState<CityMastersDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<CreateCityDto>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [states, setStates] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);

  // Search & Filters
  const [searchText, setSearchText] = useState("");
  const [selectedStateFilter, setSelectedStateFilter] = useState<string | undefined>(undefined);

  // Table Selection State
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // ==============================
  // Load Cities
  // ==============================

  const loadCities = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getCity();
      setData(Array.isArray(result) ? result : result?.data || []);
    } catch (error: unknown) {
      console.error("Load error:", error);
      message.error("Failed to load cities");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==============================
  // Load States
  // ==============================

  const loadStates = useCallback(async () => {
    try {
      const statesResult = await getState();
      setStates(Array.isArray(statesResult) ? statesResult : statesResult?.data || []);
    } catch (error) {
      console.error("State load error:", error);
      message.error("Failed to load states");
      setStates([]);
    }
  }, []);

  // ==============================
  // Initial Load
  // ==============================

  useEffect(() => {
    loadStates();
    loadCities();
  }, [loadStates, loadCities]);

  // ==============================
  // Create City
  // ==============================

  const handleCreate = async (values: CreateCityDto) => {
    try {
      await createCity(values);
      message.success("City created successfully");
      form.resetFields();
      setIsModalOpen(false);
      await loadCities();
    } catch (error: unknown) {
      console.error("Create error:", error);
      message.error(
        error instanceof Error ? error.message : "Create failed"
      );
    }
  };

  // ==============================
  // Delete City
  // ==============================

  const handleDelete = useCallback(
    async (id: number) => {
      Modal.confirm({
        title: "Delete City?",
        content: "This action cannot be undone.",
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            await deleteCity(id);
            message.success("City deleted successfully");
            setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
            await loadCities();
          } catch (error: unknown) {
            console.error("Delete error:", error);
            message.error("Delete failed");
          }
        },
      });
    },
    [loadCities]
  );

  // ==============================
  // Bulk Delete Handler
  // ==============================

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) return;

    Modal.confirm({
      title: `Delete ${selectedRowKeys.length} selected city(ies)?`,
      icon: <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,
      content: "Are you sure you want to delete all selected cities? This action cannot be undone.",
      okText: "Delete All",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          setLoading(true);
          await Promise.all(
            selectedRowKeys.map((id) => deleteCity(Number(id)))
          );
          message.success("Selected cities deleted successfully");
          setSelectedRowKeys([]);
          await loadCities();
        } catch (error) {
          console.error("Bulk delete failed:", error);
          message.error("Failed to delete selected items");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // ==============================
  // Filters & Memos
  // ==============================

  const stateFilterOptions = useMemo(() => {
    return Array.from(
      new Set(
        data
          .map((item) => item.stateName)
          .filter(Boolean)
      )
    ).map((state) => ({
      value: state,
      label: state,
    }));
  }, [data]);

  const stateSelectOptions = useMemo(() => {
    return states.map((state) => ({
      value: state.id,
      label: state.name,
    }));
  }, [states]);

  const filteredData = useMemo(() => {
    const search = searchText.toLowerCase().trim();

    return data.filter((item) => {
      const matchesState = selectedStateFilter ? item.stateName === selectedStateFilter : true;
      const matchesSearch = !search || [
        item.name,
        item.stateName,
        item.postalCode,
      ]
        .filter((value) => value !== null && value !== undefined)
        .some((value) =>
          String(value).toLowerCase().includes(search)
        );

      return matchesState && matchesSearch;
    });
  }, [data, searchText, selectedStateFilter]);

  // ==============================
  // Table Columns
  // ==============================

  const columns = useMemo<TableColumn<CityMastersDto>[]>(
    () => [
      {
        name: "City",
        selector: (row) => row.name || "-",
        sortable: true,
        grow: 2,
        wrap: true,
        cell: (row) => (
          <Space size={8}>
            <ShopOutlined style={{ color: "#3b82f6" }} />
            <Text strong style={{ color: "#1e293b" }}>{row.name || "-"}</Text>
          </Space>
        ),
      },
      {
        name: "State",
        selector: (row) => row.stateName || "-",
        sortable: true,
        grow: 1.5,
        wrap: true,
        cell: (row) => (
          <span style={{ 
            background: "#eff6ff", 
            padding: "2px 8px", 
            borderRadius: "6px", 
            border: "1px solid #bfdbfe", 
            fontWeight: 500,
            color: "#1d4ed8",
            fontSize: "12px"
          }}>
            {row.stateName || "-"}
          </span>
        ),
      },
      {
        name: "Postal Code",
        selector: (row) => String(row.postalCode || "-"),
        sortable: true,
        width: "140px",
        cell: (row) => (
          <span style={{ fontFamily: "monospace", color: "#334155", fontWeight: 500 }}>
            {row.postalCode || "-"}
          </span>
        ),
      },
      {
        name: "Created",
        selector: (row) => row.createdAt || "",
        sortable: true,
        hide: 768,
        width: "145px",
        sortFunction: (first, second) =>
          new Date(first.createdAt || 0).getTime() - new Date(second.createdAt || 0).getTime(),
        cell: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-IN") : "-",
      },
      {
        name: "Edited",
        selector: (row) => row.updatedAt || "",
        sortable: true,
        hide: 768,
        width: "145px",
        sortFunction: (first, second) =>
          new Date(first.updatedAt || 0).getTime() - new Date(second.updatedAt || 0).getTime(),
        cell: (row) => {
          if (!row.updatedAt) return "-";
          const date = new Date(row.updatedAt);
          return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("en-IN");
        },
      },
      {
        name: "Actions",
        width: "90px",
        center: true,
        cell: (row) => (
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleDelete(row.id)}
              style={{ background: "#fef2f2", borderRadius: "6px", width: 30, height: 30 }}
            />
          </Tooltip>
        ),
      },
    ],
    [handleDelete]
  );

  return (
    <div className="city-page" style={{ padding: "28px", background: "#f8fafc", minHeight: "100vh" }}>
      <style>{`
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
        
        {/* Modern Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>City Master</Title>
            <Text type="secondary" style={{ fontSize: "14px" }}>Configure and manage cities, postal codes, and regional state mappings.</Text>
          </div>
          
          <Space className="city-page-actions" wrap>
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
              Add City
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
                  placeholder="Search city, state, postal code..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ borderRadius: "8px", background: "#fff" }}
                />
              </Col>
              
              <Col xs={24} sm={8} md={8}>
                <Select
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Filter by State"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  value={selectedStateFilter}
                  onChange={(value) => setSelectedStateFilter(value)}
                  options={stateFilterOptions}
                />
              </Col>

              <Col xs={24} sm={24} md={4}>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={() => {
                    setSearchText("");
                    setSelectedStateFilter(undefined);
                  }}
                  size="large"
                  style={{ width: "100%", borderRadius: "8px", background: "#fff", color: "#64748b", fontWeight: 500 }}
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </div>

          {/* Table Counter & Selection Status Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingInline: 4 }}>
            <Text type="secondary" style={{ fontSize: "13px" }}>
              Showing <Text strong>{filteredData.length}</Text> {filteredData.length === 1 ? "city" : "cities"}
            </Text>
            {selectedRowKeys.length > 0 && (
              <Text style={{ fontSize: "13px", color: "#2563eb", fontWeight: 500 }}>
                {selectedRowKeys.length} city(ies) selected
              </Text>
            )}
          </div>

          <DataTable
            className="city-data-table"
            columns={columns}
            data={filteredData}
            keyField="id"
            selectableRows
            selectableRowsHighlight
            onSelectedRowsChange={({ selectedRows }) => setSelectedRowKeys(selectedRows.map((row) => row.id))}
            clearSelectedRows={selectedRowKeys.length === 0}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 50, 100]}
            progressPending={loading}
            persistTableHead
            highlightOnHover
            responsive
            noDataComponent={<div className="py-4 text-muted">No cities found</div>}
            customStyles={{
              headCells: { style: { fontWeight: 600, color: "#334155", backgroundColor: "#f8fafc" } },
              rows: { style: { minHeight: "58px" } },
              cells: { style: { paddingLeft: "12px", paddingRight: "12px" } },
            }}
          />
        </Card>

        {/* Create City Modal */}
        <Modal
          title={
            <div style={{ fontSize: "18px", fontWeight: 600, color: "#0f172a", paddingBottom: 4 }}>
              Create City
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
          <Form<CreateCityDto>
            form={form}
            layout="vertical"
            onFinish={handleCreate}
          >
            <Form.Item
              label={<Text strong style={{ color: "#334155" }}>City Name</Text>}
              name="name"
              rules={[
                {
                  required: true,
                  message: "Enter city name",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="e.g. Bengaluru"
                style={{ borderRadius: "8px" }}
              />
            </Form.Item>

            <Form.Item
              label={<Text strong style={{ color: "#334155" }}>Postal Code</Text>}
              name="postalCode"
              rules={[
                {
                  required: true,
                  message: "Enter postal code",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="e.g. 560001"
                maxLength={10}
                style={{ borderRadius: "8px", fontFamily: "monospace" }}
              />
            </Form.Item>

            <Form.Item
              label={<Text strong style={{ color: "#334155" }}>State</Text>}
              name="stateID"
              rules={[
                {
                  required: true,
                  message: "Select state",
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Select state"
                loading={loading}
                showSearch
                allowClear
                optionFilterProp="label"
                options={stateSelectOptions}
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
                Create City
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