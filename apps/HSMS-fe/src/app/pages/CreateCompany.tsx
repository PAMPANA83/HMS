import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Switch,
  message,
  Typography,
  Divider,
} from "antd";
import { 
  PlusOutlined, 
  ClearOutlined, 
  ShopOutlined, 
  EnvironmentOutlined, 
  SafetyCertificateOutlined 
} from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";

import { CreateCompanyDto } from "../models/Company.dto";
import { createCompany } from "../services/Company.service";
import { getState } from "../services/State.service";
import { getCity } from "../services/City.service";
import { getCountries } from "../services/country.service";

const { Title, Text } = Typography;
const { Option } = Select;

// =========================================================
// TYPES
// =========================================================

interface StateOption {
  id: number;
  name: string;
}

interface CountryOption {
  id: number;
  name: string;
}

interface CityOption {
  id: number;
  stateId: number;
  stateName: string;
  name: string;
  postalCode: string;
}

// =========================================================
// COMPONENT
// =========================================================

export function CreateCompany() {
  const [form] = Form.useForm<CreateCompanyDto>();

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

  const extractDataArrays = <T,>(result: any): T[] => {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.data?.data)) return result.data.data;
    
    if (result && typeof result === "object") {
      const foundKey = Object.keys(result).find((key) => Array.isArray(result[key]));
      if (foundKey) return result[foundKey];
    }

    return [];
  };

  // =========================================================
  // LOAD STATES
  // =========================================================

  const loadStates = useCallback(async () => {
    setStateLoading(true);
    try {
      const result = await getState();
      const data = extractDataArray<StateOption>(result);
      setStates(data);
    } catch (error) {
      console.error("Load states error:", error);
      message.error("Failed to load states");
      setStates([]);
    } finally {
      setStateLoading(false);
    }
  }, []);

  // =========================================================
  // LOAD CITIES BY STATE
  // =========================================================

  const loadCity = async (stateId: number) => {
    try {
      setCityLoading(true); 
      const result = await getCity();   
      const data = extractDataArrays<CityOption>(result);   
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
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    const loadCountries = async () => {
      setCountryLoading(true);
      try {
        const result = await getCountries();
        const data = extractDataArray<CountryOption>(result);
        setCountries(data);
      } catch (error) {
        console.error("Load countries error:", error);
        message.error("Failed to load countries");
        setCountries([]);
      } finally {
        setCountryLoading(false);
      }
    };

    loadCountries();
    loadStates();
  }, [loadStates]);

  // =========================================================
  // STATE CHANGE
  // =========================================================

  const handleStateChange = (value: number) => {
    form.setFieldsValue({
      cityId: undefined,
    });
    setCities([]);
    if (value) {
      loadCity(Number(value));
    }
  };

  const handleStateClear = () => {
    form.setFieldsValue({
      stateId: undefined,
      cityId: undefined,
    });
    setCities([]);
  };

  // =========================================================
  // CREATE COMPANY
  // =========================================================

  const handleCreate = async (values: CreateCompanyDto) => {
    setLoading(true);

    try {
      const payload: CreateCompanyDto = {
        companyname: values.companyname?.trim() || "",
        registrationNumber: values.registrationNumber?.trim() || "",
        gstin: values.gstin?.trim().toUpperCase() || "",
        panNumber: values.panNumber?.trim().toUpperCase() || "",
        email: values.email?.trim() || "",
        phone: values.phone?.trim() || "",
        website: values.website?.trim() || "",
        addressLine1: values.addressLine1?.trim() || "",
        addressLine2: values.addressLine2?.trim() || "",
        cityId: Number(values.cityId) || 0,
        stateId: Number(values.stateId) || 0,
        countryId: Number(values.countryId) || 0,
        postalCode: values.postalCode?.trim() || "",
        isActive: values.isActive ?? true,
      };

      await createCompany(payload);
      message.success("Company created successfully");
      handleReset();
    } catch (error: any) {
      console.error("Create company error:", error);
      message.error(
        error?.response?.data?.message ||
          error?.response?.data?.title ||
          "Create company failed"
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
          <Title level={3} style={{ margin: 0, fontWeight: 600, color: "#1e293b" }}>Company Management</Title>
          <Text type="secondary">Register a new company profile and manage corporate credentials.</Text>
        </div>

        <Card 
          bordered={false} 
          style={{ 
            borderRadius: "16px", 
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)" 
          }}
        >
          <Form<CreateCompanyDto>
            form={form}
            layout="vertical"
            onFinish={handleCreate}
            autoComplete="off"
            initialValues={{ isActive: true }}
            requiredMark="optional"
          >
            {/* Section: Company Profile Information */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <ShopOutlined style={{ color: "#3b82f6", fontSize: "18px" }} />
              <Text strong style={{ fontSize: "16px", color: "#334155" }}>Company Profile & Credentials</Text>
            </div>
            
            <Row gutter={20}>
              <Col xs={24} sm={12} md={12}>
                <Form.Item
                  label="Company Name"
                  name="name"
                  rules={[{ required: true, message: "Enter company name" }]}
                >
                  <Input placeholder="Arogya Healthcare Pvt Ltd" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12}>
                <Form.Item
                  label="Registration Number"
                  name="registrationNumber"
                  rules={[{ required: true, message: "Enter registration number" }]}
                >
                  <Input placeholder="U85110KA2026PTC123456" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <Form.Item
                  label="GSTIN"
                  name="gstin"
                  rules={[
                    { required: true, message: "Enter GSTIN" },
                    { len: 15, message: "GSTIN must be 15 characters" },
                  ]}
                >
                  <Input 
                    placeholder="29ABCDE1234F1Z5" 
                    maxLength={15} 
                    size="large"
                    style={{ textTransform: "uppercase" }} 
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12}>
                <Form.Item
                  label="PAN Number"
                  name="panNumber"
                  rules={[
                    { required: true, message: "Enter PAN number" },
                    { len: 10, message: "PAN must be 10 characters" },
                  ]}
                >
                  <Input 
                    placeholder="ABCDE1234F" 
                    maxLength={10} 
                    size="large"
                    style={{ textTransform: "uppercase" }} 
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Enter email" },
                    { type: "email", message: "Enter valid email" },
                  ]}
                >
                  <Input placeholder="info@arogyahealth.in" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[{ required: true, message: "Enter phone number" }]}
                >
                  <Input placeholder="+918040001122" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Website"
                  name="website"
                  rules={[{ type: "url", message: "Enter valid website URL" }]}
                >
                  <Input placeholder="https://www.example.com" size="large" />
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
                  rules={[{ required: true, message: "Enter address" }]}
                >
                  <Input.TextArea rows={2} placeholder="100 Outer Ring Road, Bellandur" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12}>
                <Form.Item
                  label="Address Line 2"
                  name="addressLine2"
                >
                  <Input.TextArea rows={2} placeholder="Additional address info" />
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
                    placeholder={countryLoading ? "Loading..." : "Select country"}
                    optionFilterProp="children"
                    loading={countryLoading}
                    disabled={countryLoading}
                    notFoundContent={countryLoading ? "Loading..." : "No countries found"}
                  >
                    {countries.map((country) => (
                      <Option key={country.id} value={country.id}>
                        {country.name}
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
                    placeholder="Select state"
                    optionFilterProp="children"
                    loading={stateLoading}
                    onChange={handleStateChange}
                    onClear={handleStateClear}
                  >
                    {states.map((state) => (
                      <Option key={state.id} value={state.id}>
                        {state.name}
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
                    placeholder={cityLoading ? "Loading..." : "Select city"}
                    optionFilterProp="children"
                    loading={cityLoading}
                    notFoundContent={cityLoading ? "Loading..." : "No cities found"}
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
                <Form.Item
                  label="Postal Code"
                  name="postalCode"
                >
                  <Input placeholder="560038" maxLength={10} size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ margin: "12px 0 24px 0" }} />

            {/* Section: Status Control */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <SafetyCertificateOutlined style={{ color: "#3b82f6", fontSize: "18px" }} />
              <Text strong style={{ fontSize: "16px", color: "#334155" }}>Account Status</Text>
            </div>

            <Row gutter={20}>
              <Col xs={24} sm={12}>
                <Form.Item name="isActive" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                    padding: "12px 16px", 
                    background: "#f1f5f9", 
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0"
                  }}>
                    <div>
                      <Text strong style={{ display: "block", color: "#334155" }}>Company Status</Text>
                      <Text type="secondary" style={{ fontSize: "13px" }}>Set organization active or inactive</Text>
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
                Create Company
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}