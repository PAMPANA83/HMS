import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Checkbox,
  message,
  Typography,
  Divider,
} from "antd";
import {
  PlusOutlined,
  ClearOutlined,
  ApartmentOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { CreateBranchDto } from "../models/Branch.dto";
import { createBranch } from "../services/Branch.service";
import { getCountries } from "../services/country.service";
import { getState } from "../services/State.service";
import { getCity } from "../services/City.service";

const { Title, Text } = Typography;
const { Option } = Select;

// =========================================================
// TYPES
// =========================================================

interface CountryOption {
  id: number;
  name: string;
}

interface StateOption {
  id: number;
  name: string;
}

interface CityOption {
  id: number;
  stateId: number;
  name: string;
}

interface CreateBranchProps {
  companyId?: number;
}

// =========================================================
// COMPONENT
// =========================================================

export function CreateBranch({ companyId = 1 }: CreateBranchProps) {
  const [form] = Form.useForm<CreateBranchDto>();

  // =========================================================
  // STATE
  // =========================================================

  const [loading, setLoading] = useState(false);
  const [countryLoading, setCountryLoading] = useState(false);
  const [stateLoading, setStateLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);

  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);

  // =========================================================
  // EXTRACT ARRAY FROM API RESPONSE
  // =========================================================

  const extractDataArray = <T,>(result: any): T[] => {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.data?.data)) return result.data.data;
    return [];
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    const loadInitialData = async () => {
      setCountryLoading(true);
      setStateLoading(true);
      try {
        const [countryRes, stateRes] = await Promise.all([
          getCountries(),
          getState(),
        ]);
        setCountries(extractDataArray<CountryOption>(countryRes));
        setStates(extractDataArray<StateOption>(stateRes));
      } catch (error) {
        console.error("Failed to load location metadata:", error);
        message.error("Failed to load dropdown data");
      } finally {
        setCountryLoading(false);
        setStateLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // =========================================================
  // LOAD CITIES BY STATE
  // =========================================================

  const loadCity = async (stateId: number) => {
    setCityLoading(true);
    try {
      const result = await getCity();
      const data = extractDataArray<CityOption>(result);
      const filteredCities = data.filter((city) => city.stateId === Number(stateId));
      setCities(filteredCities);
    } catch (error) {
      console.error("Load cities error:", error);
      message.error("Failed to load cities");
      setCities([]);
    } finally {
      setCityLoading(false);
    }
  };

  // =========================================================
  // STATE CHANGE
  // =========================================================

  const handleStateChange = (value: number) => {
    form.setFieldsValue({ cityId: undefined as unknown as number });
    setCities([]);
    if (value) {
      loadCity(Number(value));
    }
  };

  // =========================================================
  // CREATE BRANCH
  // =========================================================

  const handleCreate = async (values: CreateBranchDto) => {
    setLoading(true);
    try {
      const payload: CreateBranchDto = {
        companyId: Number(companyId) || 0,
        branchName: values.branchName?.trim() || "",
        branchCode: values.branchCode?.trim().toUpperCase() || "",
        email: values.email?.trim() || "",
        phone: values.phone?.trim() || "",
        addressLine1: values.addressLine1?.trim() || "",
        addressLine2: values.addressLine2?.trim() || null,
        cityId: Number(values.cityId) || 0,
        stateId: Number(values.stateId) || 0,
        countryId: Number(values.countryId) || 0,
        postalCode: values.postalCode?.trim() || "",
        isMainBranch: values.isMainBranch ?? false,
        isActive: values.isActive ?? true,
      };

      await createBranch(payload);
      message.success("Branch created successfully");
      handleReset();
    } catch (error: any) {
      console.error("Create branch error:", error);
      message.error(
        error?.response?.data?.message ||
          error?.response?.data?.title ||
          "Create branch failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const handleReset = () => {
    form.resetFields();
    form.setFieldsValue({
      isActive: true,
      isMainBranch: false,
    });
    setCities([]);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0, fontWeight: 600, color: "#1e293b" }}>Branch Management</Title>
          <Text type="secondary">Register a new office location and configure operational settings.</Text>
        </div>

        <Card
          bordered={false}
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
          }}
        >
          <Form<CreateBranchDto>
            form={form}
            layout="vertical"
            onFinish={handleCreate}
            autoComplete="off"
            initialValues={{
              isActive: true,
              isMainBranch: false,
            }}
            requiredMark="optional"
          >
            {/* Section: Branch Details */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <ApartmentOutlined style={{ color: "#3b82f6", fontSize: "18px" }} />
              <Text strong style={{ fontSize: "16px", color: "#334155" }}>Branch Information & Contacts</Text>
            </div>

            <Row gutter={20}>
              <Col xs={24} sm={12} md={12}>
                <Form.Item
                  label="Branch Name"
                  name="branchName"
                  rules={[{ required: true, message: "Enter branch name" }]}
                >
                  <Input placeholder="Main Branch" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <Form.Item
                  label="Branch Code"
                  name="branchCode"
                  rules={[{ required: true, message: "Enter branch code" }]}
                >
                  <Input placeholder="BR-001" size="large" style={{ textTransform: "uppercase" }} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Enter email" },
                    { type: "email", message: "Enter valid email" },
                  ]}
                >
                  <Input placeholder="branch@example.com" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[{ required: true, message: "Enter phone number" }]}
                >
                  <Input placeholder="+919876543210" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ margin: "12px 0 24px 0" }} />

            {/* Section: Location Info */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <EnvironmentOutlined style={{ color: "#3b82f6", fontSize: "18px" }} />
              <Text strong style={{ fontSize: "16px", color: "#334155" }}>Location & Address</Text>
            </div>

            <Row gutter={20}>
              <Col xs={24} sm={12} md={12}>
                <Form.Item
                  label="Address Line 1"
                  name="addressLine1"
                  rules={[{ required: true, message: "Enter address line 1" }]}
                >
                  <Input.TextArea rows={2} placeholder="Street address" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <Form.Item label="Address Line 2" name="addressLine2">
                  <Input.TextArea rows={2} placeholder="Apartment, suite, etc." />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  label="Country"
                  name="countryId"
                  rules={[{ required: true, message: "Select country" }]}
                >
                  <Select
                    showSearch
                    allowClear
                    size="large"
                    placeholder="Select Country"
                    optionFilterProp="children"
                    loading={countryLoading}
                  >
                    {countries.map((c) => (
                      <Option key={c.id} value={c.id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  label="State"
                  name="stateId"
                  rules={[{ required: true, message: "Select state" }]}
                >
                  <Select
                    showSearch
                    allowClear
                    size="large"
                    placeholder="Select State"
                    optionFilterProp="children"
                    loading={stateLoading}
                    onChange={handleStateChange}
                  >
                    {states.map((s) => (
                      <Option key={s.id} value={s.id}>
                        {s.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  label="City"
                  name="cityId"
                  rules={[{ required: true, message: "Select city" }]}
                >
                  <Select
                    showSearch
                    allowClear
                    size="large"
                    placeholder={cityLoading ? "Loading..." : "Select City"}
                    optionFilterProp="children"
                    loading={cityLoading}
                    disabled={cityLoading || cities.length === 0}
                  >
                    {cities.map((city) => (
                      <Option key={city.id} value={city.id}>
                        {city.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Postal Code" name="postalCode">
                  <Input placeholder="560001" maxLength={10} size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ margin: "12px 0 24px 0" }} />

            {/* Section: Status & Configuration */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <SafetyCertificateOutlined style={{ color: "#3b82f6", fontSize: "18px" }} />
              <Text strong style={{ fontSize: "16px", color: "#334155" }}>Configuration & Status</Text>
            </div>

            <Row gutter={20}>
              <Col xs={24} sm={12}>
                <Form.Item name="isMainBranch" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#f1f5f9",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                  }}>
                    <div>
                      <Text strong style={{ display: "block", color: "#334155" }}>Main Branch Designation</Text>
                      <Text type="secondary" style={{ fontSize: "13px" }}>Designate as primary office location</Text>
                    </div>
                    <Checkbox />
                  </div>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="isActive" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#f1f5f9",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                  }}>
                    <div>
                      <Text strong style={{ display: "block", color: "#334155" }}>Branch Status</Text>
                      <Text type="secondary" style={{ fontSize: "13px" }}>Set branch active or inactive</Text>
                    </div>
                    <Switch />
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ margin: "12px 0 24px 0" }} />

            {/* Form Actions */}
            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Button
                icon={<ClearOutlined />}
                onClick={handleReset}
                disabled={loading}
                size="large"
                style={{ marginRight: 12, borderRadius: "8px" }}
              >
                Reset Form
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={loading}
                size="large"
                style={{ borderRadius: "8px", paddingLeft: 24, paddingRight: 24 }}
              >
                Create Branch
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}