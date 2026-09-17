import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import {
  PlusOutlined,
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

const initialForm = (companyId: number): CreateBranchDto => ({
  companyId,
  branchName: "",
  branchCode: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  cityId: 0,
  stateId: 0,
  countryId: 0,
  postalCode: "",
  isMainBranch: false,
  isActive: true,
});

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
  // =========================================================
  // STATE
  // =========================================================

  const [formData, setFormData] = useState<CreateBranchDto>(() => initialForm(companyId));
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

  const extractDataArray = <T,>(result: unknown): T[] => {
    if (!result || typeof result !== "object") return [];
    const response = result as { data?: unknown };
    if (Array.isArray(result)) return result;
    if (Array.isArray(response.data)) return response.data as T[];
    if (response.data && typeof response.data === "object" && Array.isArray((response.data as { data?: unknown }).data)) {
      return (response.data as { data: T[] }).data;
    }
    return [];
  };

  const notify = (text: string) => window.alert(text);
  const updateField = <K extends keyof CreateBranchDto>(field: K, value: CreateBranchDto[K]) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
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
        notify("Failed to load dropdown data");
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
      notify("Failed to load cities");
      setCities([]);
    } finally {
      setCityLoading(false);
    }
  };

  // =========================================================
  // STATE CHANGE
  // =========================================================

  const handleStateChange = (value: number) => {
    updateField("stateId", value);
    updateField("cityId", 0);
    setCities([]);
    if (value) {
      loadCity(Number(value));
    }
  };

  // =========================================================
  // CREATE BRANCH
  // =========================================================

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.branchName.trim() || !formData.branchCode.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.addressLine1.trim() || !formData.countryId || !formData.stateId || !formData.cityId) {
      notify("Please complete all required fields.");
      return;
    }
    setLoading(true);
    try {
      const payload: CreateBranchDto = {
        companyId: Number(companyId) || 0,
        branchName: formData.branchName.trim(),
        branchCode: formData.branchCode.trim().toUpperCase(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        addressLine1: formData.addressLine1.trim(),
        addressLine2: formData.addressLine2?.trim() || null,
        cityId: Number(formData.cityId),
        stateId: Number(formData.stateId),
        countryId: Number(formData.countryId),
        postalCode: formData.postalCode.trim(),
        isMainBranch: formData.isMainBranch,
        isActive: formData.isActive,
      };

      await createBranch(payload);
      notify("Branch created successfully");
      handleReset();
    } catch (error: unknown) {
      console.error("Create branch error:", error);
      notify(error instanceof Error ? error.message : "Create branch failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const handleReset = () => {
    setFormData(initialForm(companyId));
    setCities([]);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="create-branch-page p-2 p-md-4 min-vh-100">
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="create-branch-hero mb-4"><div className="eyebrow">Operations workspace</div><h3 className="mb-1 fw-bold text-dark">Branch Management</h3><p className="text-muted mb-0">Register a new office location and configure operational settings.</p></div>
        <Card className="create-branch-card border-0"><Card.Body className="p-3 p-md-4 p-lg-5">
          <Form onSubmit={handleCreate} noValidate>
            <div className="form-section-heading mb-3"><span className="section-icon"><ApartmentOutlined /></span><div><strong>Branch Information & Contacts</strong><small>Basic identity and communication details</small></div></div>
            <Row className="g-3">
              <Col xs={12} md={6}><Form.Group><Form.Label>Branch Name</Form.Label><Form.Control required value={formData.branchName} onChange={(e) => updateField("branchName", e.target.value)} placeholder="Main Branch" /></Form.Group></Col>
              <Col xs={12} md={6}><Form.Group><Form.Label>Branch Code</Form.Label><Form.Control required value={formData.branchCode} onChange={(e) => updateField("branchCode", e.target.value.toUpperCase())} placeholder="BR-001" /></Form.Group></Col>
              <Col xs={12} md={6}><Form.Group><Form.Label>Email</Form.Label><Form.Control required type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="branch@example.com" /></Form.Group></Col>
              <Col xs={12} md={6}><Form.Group><Form.Label>Phone</Form.Label><Form.Control required value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+919876543210" /></Form.Group></Col>
            </Row>
            <hr className="my-4" />
            <div className="form-section-heading mb-3"><span className="section-icon"><EnvironmentOutlined /></span><div><strong>Location & Address</strong><small>Connect this branch to its administrative location</small></div></div>
            <Row className="g-3">
              <Col xs={12} md={6}><Form.Group><Form.Label>Address Line 1</Form.Label><Form.Control required as="textarea" rows={2} value={formData.addressLine1} onChange={(e) => updateField("addressLine1", e.target.value)} placeholder="Street address" /></Form.Group></Col>
              <Col xs={12} md={6}><Form.Group><Form.Label>Address Line 2</Form.Label><Form.Control as="textarea" rows={2} value={formData.addressLine2 || ""} onChange={(e) => updateField("addressLine2", e.target.value)} placeholder="Apartment, suite, etc." /></Form.Group></Col>
              <Col xs={12} sm={6} md={3}><Form.Group><Form.Label>Country</Form.Label><Form.Select required disabled={countryLoading} value={formData.countryId || ""} onChange={(e) => updateField("countryId", Number(e.target.value))}><option value="">{countryLoading ? "Loading..." : "Select country"}</option>{countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={12} sm={6} md={3}><Form.Group><Form.Label>State</Form.Label><Form.Select required disabled={stateLoading} value={formData.stateId || ""} onChange={(e) => handleStateChange(Number(e.target.value))}><option value="">{stateLoading ? "Loading..." : "Select state"}</option>{states.map((state) => <option key={state.id} value={state.id}>{state.name}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={12} sm={6} md={3}><Form.Group><Form.Label>City</Form.Label><Form.Select required disabled={!formData.stateId || cityLoading} value={formData.cityId || ""} onChange={(e) => updateField("cityId", Number(e.target.value))}><option value="">{cityLoading ? "Loading..." : "Select city"}</option>{cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={12} sm={6} md={3}><Form.Group><Form.Label>Postal Code</Form.Label><Form.Control maxLength={10} value={formData.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} placeholder="560001" /></Form.Group></Col>
            </Row>
            <hr className="my-4" />
            <div className="form-section-heading mb-3"><span className="section-icon"><SafetyCertificateOutlined /></span><div><strong>Configuration & Status</strong><small>Set the branch role and availability</small></div></div>
            <Row className="g-3"><Col xs={12} sm={6}><div className="setting-tile"><Form.Check type="switch" label="Main branch designation" checked={formData.isMainBranch} onChange={(e) => updateField("isMainBranch", e.target.checked)} /></div></Col><Col xs={12} sm={6}><div className="setting-tile"><Form.Check type="switch" label="Branch is active" checked={formData.isActive} onChange={(e) => updateField("isActive", e.target.checked)} /></div></Col></Row>
            <hr className="my-4" />
            <div className="d-flex justify-content-end gap-2 flex-wrap"><Button variant="outline-secondary" type="button" onClick={handleReset} disabled={loading}>Reset Form</Button><Button variant="primary" type="submit" disabled={loading} className="d-flex align-items-center gap-2">{loading && <Spinner animation="border" size="sm" />}<PlusOutlined /> Create Branch</Button></div>
          </Form>
        </Card.Body></Card>
      </div>
    </div>
  );
}