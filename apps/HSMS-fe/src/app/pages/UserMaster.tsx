import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Upload,
  message,
  Typography,
  Divider,
} from "antd";
import { 
  UploadOutlined, 
  ClearOutlined, 
  UserOutlined, 
  EnvironmentOutlined, 
  ApartmentOutlined,
  SafetyCertificateOutlined 
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useCallback, useState, useEffect } from "react";
import { createuser, uploadImage } from "../services/UserLogin.service";
import { CreateUserDto } from "../models/User.dto";
import { getCompany } from "../services/Company.service";
import { getBranch } from "../services/Branch.service";
import { getDepartment } from "../services/Department.service";
import { getRole } from "../services/Role.service";
import { getCountries } from "../services/country.service";
import { getState } from "../services/State.service";
import { getCity } from "../services/City.service";

const { Title, Text } = Typography;

interface CompanyOption {
  id?: number;
  companyname?: string;
}

interface BranchOption {
  id?: number;
  branchName?: string;
}

interface DepartmentOption {
  id?: number;
  name?: string;
  branchId?: number;
}

interface RolesOption {
  id?: number;
  roleName?: string;
}

interface CountryOption {
  id: number;
  name: string;
}

interface StateOption {
  id: number;
  countryId?: number;
  name: string;
}

interface CityOption {
  id: number;
  stateId: number;
  name: string;
}

const employeeTypes = [
  { code: 'DOC', label: 'Doctor (DOC)' },
  { code: 'ADM', label: 'Administrative (ADM)' },
  { code: 'NUR', label: 'Nurse (NUR)' },
  { code: 'LAB', label: 'Laboratory Technician (LAB)' },
  { code: 'PHAR', label: 'Pharmacist (PHAR)' },
  { code: 'REC', label: 'Receptionist (REC)' }
];

export function UserMaster() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [companyList, setCompany] = useState<CompanyOption[]>([]);
  const [branchList, setBranch] = useState<BranchOption[]>([]);
  const [departmentList, setDepartment] = useState<DepartmentOption[]>([]);
  const [RoleList, setrole] = useState<RolesOption[]>([]);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);

  const extractDataArray = <T,>(result: any): T[] => {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.data?.data)) return result.data.data;
    return [];
  };

  const storedUser = localStorage.getItem("user");

  const loadCompany = useCallback(async () => {
    try {
      const result = await getCompany();
      setCompany(extractDataArray<CompanyOption>(result));
    } catch (error) {
      console.error("Load company error:", error);
      message.error("Failed to load companies");
      setCompany([]);
    }
  }, []);

  const loadBranch = useCallback(async () => {
    try {
      const result = await getBranch();
      setBranch(extractDataArray<BranchOption>(result));
    } catch (error) {
      console.error("Load Branch error:", error);
      message.error("Failed to load branches");
      setBranch([]);
    }
  }, []);

  const loadDepartment = useCallback(async (branchId?: number) => {
    try {
      setLoading(true);
      const result = await getDepartment();
      const data = extractDataArray<DepartmentOption>(result);
      if (branchId) {
        setDepartment(data.filter((d: any) => Number(d.branchId || d.branch_id) === Number(branchId)));
      } else {
        setDepartment(data);
      }
    } catch (error) {
      console.error("Load Department error:", error);
      message.error("Failed to load departments");
      setDepartment([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRoles = useCallback(async () => {
    try {
      const result = await getRole();
      setrole(extractDataArray<RolesOption>(result));
    } catch (error) {
      console.error("Load role error:", error);
      message.error("Failed to load role");
      setrole([]);
    }
  }, []);

  const loadCountry = useCallback(async () => {
    try {
      const result = await getCountries();
      setCountries(extractDataArray<CountryOption>(result));
    } catch (error) {
      console.error("Load country error:", error);
      message.error("Failed to load countries");
      setCountries([]);
    }
  }, []);

  const loadState = useCallback(async (countryId: number) => {
    try {
      setLoading(true);
      const result = await getState();
      const data = extractDataArray<StateOption>(result);
      if (countryId) {
        setStates(data.filter((s: any) => Number(s.countryId || s.country_id) === Number(countryId)));
      } else {
        setStates(data);
      }
    } catch (error) {
      console.error("Load state error:", error);
      message.error("Failed to load states");
      setStates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCity = useCallback(async (stateId: number) => {
    try {
      setLoading(true);
      const result = await getCity();
      const data = extractDataArray<CityOption>(result);
      if (stateId) {
        setCities(data.filter((c: any) => Number(c.stateId || c.state_id) === Number(stateId)));
      } else {
        setCities(data);
      }
    } catch (error) {
      console.error("Load city error:", error);
      message.error("Failed to load cities");
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompany();
    loadBranch();
    loadRoles();
    loadCountry();
  }, [loadCompany, loadBranch, loadRoles, loadCountry]);

  const handleBranchChange = (value: number) => {
    form.setFieldsValue({ departmentId: undefined });
    setDepartment([]);
    if (value) loadDepartment(Number(value));
  };

  const handleCountryChange = (value: number) => {
    form.setFieldsValue({ stateId: undefined, cityId: undefined });
    setStates([]);
    setCities([]);
    if (value) loadState(Number(value));
  };

  const handleStateChange = (value: number) => {
    form.setFieldsValue({ cityId: undefined });
    setCities([]);
    if (value) loadCity(Number(value));
  };

  const handleResetForm = () => {
    form.resetFields();
    setFileList([]);
    setCompany([]);
    setBranch([]);
    setDepartment([]);
    setrole([]);
    setStates([]);
    setCities([]);
    loadCompany();
    loadBranch();
    loadRoles();
    loadCountry();
  };

  const customUpload = async (file: File) => {
    try {
      const result: any = await uploadImage(file);
      message.success("Image uploaded successfully!");
      return result?.data || result;
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Upload failed.");
      throw error;
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      let profileImageUrlValue = "";
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0].originFileObj;
        const uploadResult = await customUpload(file);
        if (uploadResult?.url) {
          profileImageUrlValue = uploadResult.url;
        }
      }

      const payload: CreateUserDto = {
        companyId: Number(values.companyId),
        branchId: Number(values.branchId),
        departmentId: Number(values.departmentId),
        roleId: Number(values.roleId),
        employeeCode: values.employeeCode,
        firstName: values.firstName,
        lastName: values.lastName || "",
        gender: values.gender,
        dateOfBirth: values.dateOfBirth || "",
        email: values.email,
        password: values.password,
        phone: values.phone,
        emergencyContact: values.emergencyContact || "",
        addressLine1: values.addressLine1 || "",
        cityId: Number(values.cityId),
        stateId: Number(values.stateId),
        countryId: Number(values.countryId),
        postalCode: values.postalCode || "",
        isActive: values.isActive ?? true,
        joinedDate: values.joinedDate || "",
        profileImageUrl: profileImageUrlValue,
        createdBy: storedUser ? JSON.parse(storedUser).userId : 0
      };

      await createuser(payload);
      message.success("User created successfully");

      form.resetFields();
      setFileList([]);
    } catch (error: any) {
      console.error(error);
      message.error(error?.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 600, color: "#1e293b" }}>User Management</Title>
            <Text type="secondary">Create a new system user profile and assign operational permissions.</Text>
          </div>
        </div>

        <Card 
          bordered={false} 
          style={{ 
            borderRadius: "16px", 
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)" 
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            initialValues={{ isActive: true }}
            requiredMark="optional"
          >
            {/* Section: Organizational Info */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <ApartmentOutlined style={{ color: "#3b82f6", fontSize: "18px" }} />
              <Text strong style={{ fontSize: "16px", color: "#334155" }}>Organizational Context</Text>
            </div>
            
            <Row gutter={20}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="companyId" label="Company" rules={[{ required: true, message: "Select company" }]}>
                  <Select placeholder="Select Company" size="large" options={companyList.map((c) => ({ value: c.id, label: c.companyname }))} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="branchId" label="Branch" rules={[{ required: true, message: "Select branch" }]}>
                  <Select placeholder="Select Branch" size="large" onChange={handleBranchChange} options={branchList.map((b) => ({ value: b.id, label: b.branchName }))} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="departmentId" label="Department" rules={[{ required: true, message: "Select department" }]}>
                  <Select placeholder="Select Department" size="large" options={departmentList.map((d) => ({ value: d.id, label: d.name }))} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="roleId" label="Role" rules={[{ required: true, message: "Select role" }]}>
                  <Select placeholder="Select Role" size="large" options={RoleList.map((d) => ({ value: d.id, label: d.roleName }))} />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ margin: "12px 0 24px 0" }} />

            {/* Section: Personal & Account Info */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <UserOutlined style={{ color: "#3b82f6", fontSize: "18px" }} />
              <Text strong style={{ fontSize: "16px", color: "#334155" }}>Personal & Account Details</Text>
            </div>

            <Row gutter={20}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item name="employeeCode" label="Employee Type" rules={[{ required: true, message: "Select employee type" }]}>
                  <Select placeholder="Select Employee Type" size="large" options={employeeTypes.map((d) => ({ value: d.code, label: d.label }))} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: "Enter first name" }]}>
                  <Input placeholder="First Name" size="large" autoComplete="off" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item name="lastName" label="Last Name">
                  <Input placeholder="Last Name" size="large" autoComplete="off" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Select gender" }]}>
                  <Select placeholder="Select Gender" size="large">
                    <Select.Option value="Male">Male</Select.Option>
                    <Select.Option value="Female">Female</Select.Option>
                    <Select.Option value="Other">Other</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item name="dateOfBirth" label="Date of Birth">
                  <Input type="date" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item name="joinedDate" label="Joined Date">
                  <Input type="date" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <Form.Item name="email" label="Email Address" rules={[{ required: true, type: "email", message: "Enter valid email" }]}>
                  <Input placeholder="user@example.com" size="large" autoComplete="off" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12}>
                <Form.Item name="password" label="Password" rules={[{ required: true, message: "Enter password" }]}>
                  <Input.Password placeholder="••••••••" size="large" autoComplete="new-password" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: "Enter phone number" }]}>
                  <Input placeholder="9876543210" size="large" autoComplete="off" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12}>
                <Form.Item name="emergencyContact" label="Emergency Contact">
                  <Input placeholder="Emergency contact number" size="large" autoComplete="off" />
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
              <Col xs={24} md={24}>
                <Form.Item name="addressLine1" label="Street Address">
                  <Input.TextArea placeholder="Enter full address..." rows={2} autoComplete="off" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item name="countryId" label="Country">
                  <Select placeholder="Select Country" size="large" onChange={handleCountryChange} options={countries.map((d) => ({ value: d.id, label: d.name }))} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item name="stateId" label="State">
                  <Select placeholder="Select State" size="large" onChange={handleStateChange} options={states.map((b) => ({ value: b.id, label: b.name }))} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item name="cityId" label="City">
                  <Select placeholder="Select City" size="large" options={cities.map((c) => ({ value: c.id, label: c.name }))} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={12}>
                <Form.Item name="postalCode" label="Postal Code">
                  <Input placeholder="Postal Code" size="large" autoComplete="off" />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ margin: "12px 0 24px 0" }} />

            {/* Section: Media & Access Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <SafetyCertificateOutlined style={{ color: "#3b82f6", fontSize: "18px" }} />
              <Text strong style={{ fontSize: "16px", color: "#334155" }}>Access & Profile Setup</Text>
            </div>

            <Row gutter={20} align="middle">
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
                      <Text strong style={{ display: "block", color: "#334155" }}>Account Status</Text>
                      <Text type="secondary" style={{ fontSize: "13px" }}>Enable or disable user system access</Text>
                    </div>
                    <Switch />
                  </div>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item label="Profile Avatar" style={{ marginBottom: 0 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "12px 16px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px"
                  }}>
                    <Upload
                      accept="image/png,image/jpeg,image/jpg"
                      maxCount={1}
                      showUploadList={false}
                      beforeUpload={() => false}
                      fileList={fileList}
                      onChange={({ fileList }) => setFileList(fileList)}
                    >
                      <div style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        background: "#e2e8f0",
                        backgroundImage: fileList.length > 0 && fileList[0].originFileObj ? `url(${URL.createObjectURL(fileList[0].originFileObj)})` : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        border: "2px dashed #94a3b8",
                        position: "relative",
                        overflow: "hidden"
                      }}>
                        {fileList.length === 0 && <UploadOutlined style={{ fontSize: "20px", color: "#64748b" }} />}
                      </div>
                    </Upload>
                    <div>
                      <Text strong style={{ display: "block", color: "#334155" }}>Upload Avatar</Text>
                      <Text type="secondary" style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}>PNG, JPG or JPEG up to 5MB</Text>
                      {fileList.length > 0 && (
                        <Button 
                          type="link" 
                          danger 
                          size="small" 
                          style={{ padding: 0, height: "auto", fontSize: "12px" }}
                          onClick={() => setFileList([])}
                        >
                          Remove photo
                        </Button>
                      )}
                    </div>
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ margin: "12px 0 24px 0" }} />

            {/* Form Actions */}
            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Button 
                icon={<ClearOutlined />} 
                onClick={handleResetForm} 
                disabled={loading} 
                size="large"
                style={{ marginRight: 12, borderRadius: "8px" }}
              >
                Reset Form
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                size="large"
                style={{ borderRadius: "8px", paddingLeft: 24, paddingRight: 24 }}
              >
                Create User
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}