import { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Form } from "react-bootstrap";
import { message } from "antd";
import {
  ApartmentOutlined,
  ClearOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { createuser, uploadImage } from "../services/UserLogin.service";
import { CreateUserDto } from "../models/User.dto";
import { getCompany } from "../services/Company.service";
import { getBranch } from "../services/Branch.service";
import { getDepartment } from "../services/Department.service";
import { getRole } from "../services/Role.service";
import { getCountries } from "../services/country.service";
import { getState } from "../services/State.service";
import { getCity } from "../services/City.service";

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

interface FormDataState {
  companyId: string;
  branchId: string;
  departmentId: string;
  roleId: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  joinedDate: string;
  email: string;
  password: string;
  phone: string;
  emergencyContact: string;
  addressLine1: string;
  countryId: string;
  stateId: string;
  cityId: string;
  postalCode: string;
  isActive: boolean;
}

const employeeTypes = [
  { code: "DOC", label: "Doctor (DOC)" },
  { code: "ADM", label: "Administrative (ADM)" },
  { code: "NUR", label: "Nurse (NUR)" },
  { code: "LAB", label: "Laboratory Technician (LAB)" },
  { code: "PHAR", label: "Pharmacist (PHAR)" },
  { code: "REC", label: "Receptionist (REC)" },
];

const initialFormState: FormDataState = {
  companyId: "",
  branchId: "",
  departmentId: "",
  roleId: "",
  employeeCode: "",
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  joinedDate: "",
  email: "",
  password: "",
  phone: "",
  emergencyContact: "",
  addressLine1: "",
  countryId: "",
  stateId: "",
  cityId: "",
  postalCode: "",
  isActive: true,
};

export function UserMaster() {
  const [loading, setLoading] = useState(false);
  const [companyList, setCompany] = useState<CompanyOption[]>([]);
  const [branchList, setBranch] = useState<BranchOption[]>([]);
  const [departmentList, setDepartment] = useState<DepartmentOption[]>([]);
  const [roleList, setRole] = useState<RolesOption[]>([]);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormDataState>(initialFormState);

  const storedUser = localStorage.getItem("user");

  const extractDataArray = <T,>(result: any): T[] => {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.data?.data)) return result.data.data;
    return [];
  };

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
      setRole(extractDataArray<RolesOption>(result));
    } catch (error) {
      console.error("Load role error:", error);
      message.error("Failed to load role");
      setRole([]);
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

  const updateField = (field: keyof FormDataState, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBranchChange = (value: string) => {
    updateField("branchId", value);
    updateField("departmentId", "");
    setDepartment([]);
    if (value) loadDepartment(Number(value));
  };

  const handleCountryChange = (value: string) => {
    updateField("countryId", value);
    updateField("stateId", "");
    updateField("cityId", "");
    setStates([]);
    setCities([]);
    if (value) loadState(Number(value));
  };

  const handleStateChange = (value: string) => {
    updateField("stateId", value);
    updateField("cityId", "");
    setCities([]);
    if (value) loadCity(Number(value));
  };

  const handleResetForm = () => {
    setFormData(initialFormState);
    setSelectedFile(null);
    setFilePreview(null);
    setCompany([]);
    setBranch([]);
    setDepartment([]);
    setRole([]);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }

    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requiredFields: (keyof FormDataState)[] = [
      "companyId",
      "branchId",
      "departmentId",
      "roleId",
      "employeeCode",
      "firstName",
      "gender",
      "email",
      "password",
      "phone",
    ];

    const missingField = requiredFields.find((field) => !String(formData[field] ?? "").trim());
    if (missingField) {
      message.error("Please complete all required fields before submitting.");
      return;
    }

    try {
      setLoading(true);

      let profileImageUrlValue = "";
      if (selectedFile) {
        const uploadResult = await customUpload(selectedFile);
        if (uploadResult?.url) {
          profileImageUrlValue = uploadResult.url;
        }
      }

      const payload: CreateUserDto = {
        companyId: Number(formData.companyId),
        branchId: Number(formData.branchId),
        departmentId: Number(formData.departmentId),
        roleId: Number(formData.roleId),
        employeeCode: formData.employeeCode,
        firstName: formData.firstName,
        lastName: formData.lastName || "",
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth || "",
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        emergencyContact: formData.emergencyContact || "",
        addressLine1: formData.addressLine1 || "",
        cityId: Number(formData.cityId),
        stateId: Number(formData.stateId),
        countryId: Number(formData.countryId),
        postalCode: formData.postalCode || "",
        isActive: formData.isActive ?? true,
        joinedDate: formData.joinedDate || "",
        profileImageUrl: profileImageUrlValue,
        createdBy: storedUser ? JSON.parse(storedUser).userId : 0,
      };

      await createuser(payload);
      message.success("User created successfully");
      setFormData(initialFormState);
      setSelectedFile(null);
      setFilePreview(null);
    } catch (error: any) {
      console.error(error);
      message.error(error?.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 p-3 p-md-4">
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-1 fw-bold text-dark">User Management</h3>
            <p className="text-muted mb-0">Create a new system user profile and assign operational permissions.</p>
          </div>
        </div>

        <Card className="border-0 shadow-sm rounded-4">
          <Card.Body className="p-2 p-md-4">
            <Form onSubmit={handleSubmit} className="row g-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <ApartmentOutlined className="text-primary" />
                <strong className="text-dark">Organizational Context</strong>
              </div>

              <Form.Group as={Col} xs={12} sm={6} md={3} controlId="companyId">
                <Form.Label>Company</Form.Label>
                <Form.Select value={formData.companyId} onChange={(e) => updateField("companyId", e.target.value)}>
                  <option value="">Select Company</option>
                  {companyList.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.companyname}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} md={3} controlId="branchId">
                <Form.Label>Branch</Form.Label>
                <Form.Select value={formData.branchId} onChange={(e) => handleBranchChange(e.target.value)}>
                  <option value="">Select Branch</option>
                  {branchList.map((b) => (
                    <option key={b.id} value={String(b.id)}>
                      {b.branchName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} md={3} controlId="departmentId">
                <Form.Label>Department</Form.Label>
                <Form.Select value={formData.departmentId} onChange={(e) => updateField("departmentId", e.target.value)}>
                  <option value="">Select Department</option>
                  {departmentList.map((d) => (
                    <option key={d.id} value={String(d.id)}>
                      {d.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} md={3} controlId="roleId">
                <Form.Label>Role</Form.Label>
                <Form.Select value={formData.roleId} onChange={(e) => updateField("roleId", e.target.value)}>
                  <option value="">Select Role</option>
                  {roleList.map((d) => (
                    <option key={d.id} value={String(d.id)}>
                      {d.roleName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="w-100 border-top my-2" />

              <div className="d-flex align-items-center gap-2 mb-2">
                <UserOutlined className="text-primary" />
                <strong className="text-dark">Personal & Account Details</strong>
              </div>

              <Form.Group as={Col} xs={12} sm={6} md={4} controlId="employeeCode">
                <Form.Label>Employee Type</Form.Label>
                <Form.Select value={formData.employeeCode} onChange={(e) => updateField("employeeCode", e.target.value)}>
                  <option value="">Select Employee Type</option>
                  {employeeTypes.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} md={4} controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="First Name" />
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} md={4} controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Last Name" />
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} md={4} controlId="gender">
                <Form.Label>Gender</Form.Label>
                <Form.Select value={formData.gender} onChange={(e) => updateField("gender", e.target.value)}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} md={4} controlId="dateOfBirth">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control type="date" value={formData.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} />
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} md={4} controlId="joinedDate">
                <Form.Label>Joined Date</Form.Label>
                <Form.Control type="date" value={formData.joinedDate} onChange={(e) => updateField("joinedDate", e.target.value)} />
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="user@example.com" />
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={formData.password} onChange={(e) => updateField("password", e.target.value)} placeholder="••••••••" />
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} controlId="phone">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="9876543210" />
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} controlId="emergencyContact">
                <Form.Label>Emergency Contact</Form.Label>
                <Form.Control value={formData.emergencyContact} onChange={(e) => updateField("emergencyContact", e.target.value)} placeholder="Emergency contact number" />
              </Form.Group>

              <div className="w-100 border-top my-2" />

              <div className="d-flex align-items-center gap-2 mb-2">
                <EnvironmentOutlined className="text-primary" />
                <strong className="text-dark">Location & Address</strong>
              </div>

              <Form.Group as={Col} xs={12} controlId="addressLine1">
                <Form.Label>Street Address</Form.Label>
                <Form.Control as="textarea" rows={2} value={formData.addressLine1} onChange={(e) => updateField("addressLine1", e.target.value)} placeholder="Enter full address..." />
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} md={4} controlId="countryId">
                <Form.Label>Country</Form.Label>
                <Form.Select value={formData.countryId} onChange={(e) => handleCountryChange(e.target.value)}>
                  <option value="">Select Country</option>
                  {countries.map((d) => (
                    <option key={d.id} value={String(d.id)}>
                      {d.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} md={4} controlId="stateId">
                <Form.Label>State</Form.Label>
                <Form.Select value={formData.stateId} onChange={(e) => handleStateChange(e.target.value)}>
                  <option value="">Select State</option>
                  {states.map((b) => (
                    <option key={b.id} value={String(b.id)}>
                      {b.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} md={4} controlId="cityId">
                <Form.Label>City</Form.Label>
                <Form.Select value={formData.cityId} onChange={(e) => updateField("cityId", e.target.value)}>
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} xs={12} controlId="postalCode">
                <Form.Label>Postal Code</Form.Label>
                <Form.Control value={formData.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} placeholder="Postal Code" />
              </Form.Group>

              <div className="w-100 border-top my-2" />

              <div className="d-flex align-items-center gap-2 mb-2">
                <SafetyCertificateOutlined className="text-primary" />
                <strong className="text-dark">Access & Profile Setup</strong>
              </div>

              <Form.Group as={Col} xs={12} sm={6} className="d-flex align-items-stretch">
                <div className="w-100 rounded-3 border bg-light p-3 d-flex align-items-center justify-content-between gap-3">
                  <div>
                    <div className="fw-semibold text-dark">Account Status</div>
                    <small className="text-muted">Enable or disable user system access</small>
                  </div>
                  <Form.Check
                    type="switch"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => updateField("isActive", e.target.checked)}
                  />
                </div>
              </Form.Group>

              <Form.Group as={Col} xs={12} sm={6} controlId="profileImage">
                <div className="rounded-3 border bg-light p-3 h-100">
                  <Form.Label className="d-block mb-3">Profile Avatar</Form.Label>
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <label
                      className="d-flex align-items-center justify-content-center rounded-circle border border-2 border-secondary-subtle bg-secondary-subtle position-relative overflow-hidden"
                      style={{ width: 64, height: 64, cursor: "pointer" }}
                    >
                      {filePreview ? (
                        <img src={filePreview} alt="Preview" className="w-100 h-100 object-fit-cover" />
                      ) : (
                        <UploadOutlined className="text-secondary" style={{ fontSize: 20 }} />
                      )}
                      <input type="file" accept="image/png,image/jpeg,image/jpg" className="d-none" onChange={handleFileChange} />
                    </label>
                    <div>
                      <div className="fw-semibold text-dark">Upload Avatar</div>
                      <small className="text-muted d-block mb-2">PNG, JPG or JPEG up to 5MB</small>
                      {selectedFile && (
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 text-danger"
                          onClick={() => {
                            setSelectedFile(null);
                            setFilePreview(null);
                          }}
                        >
                          Remove photo
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Form.Group>

              <div className="w-100 border-top my-2" />

              <div className="col-12 d-flex justify-content-end gap-2 flex-wrap">
                <Button type="button" variant="outline-secondary" className="d-flex align-items-center gap-2" onClick={handleResetForm} disabled={loading}>
                  <ClearOutlined /> Reset Form
                </Button>
                <Button type="submit" variant="primary" className="px-4" disabled={loading}>
                  {loading ? "Creating..." : "Create User"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
