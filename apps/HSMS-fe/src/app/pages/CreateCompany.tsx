import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { 
  PlusOutlined, 
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

const initialForm: CreateCompanyDto = {
  companyname: "",
  registrationNumber: "",
  gstin: "",
  panNumber: "",
  email: "",
  phone: "",
  website: "",
  addressLine1: "",
  addressLine2: "",
  cityId: 0,
  stateId: 0,
  countryId: 0,
  postalCode: "",
  isActive: true,
};

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
  // =========================================================
  // STATE
  // =========================================================

  const [formData, setFormData] = useState<CreateCompanyDto>(initialForm);
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

  const extractDataArrays = <T,>(result: unknown): T[] => {
    if (!result || typeof result !== "object") return [];
    const response = result as { data?: unknown };
    if (Array.isArray(result)) return result;
    if (Array.isArray(response.data)) return response.data as T[];
    if (response.data && typeof response.data === "object" && Array.isArray((response.data as { data?: unknown }).data)) {
      return (response.data as { data: T[] }).data;
    }
    
    const foundKey = Object.keys(result).find((key) => Array.isArray((result as Record<string, unknown>)[key]));
    if (foundKey) return (result as Record<string, T[]>)[foundKey];
    return [];
  };

  const notify = (text: string) => {
    window.alert(text);
  };

  const updateField = <K extends keyof CreateCompanyDto>(field: K, value: CreateCompanyDto[K]) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.companyname.trim() || !formData.registrationNumber.trim() || !formData.gstin.trim() || !formData.panNumber.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.addressLine1.trim() || !formData.countryId || !formData.stateId || !formData.cityId) {
      notify("Please complete all required fields.");
      return false;
    }
    if (formData.gstin.trim().length !== 15 || formData.panNumber.trim().length !== 10) {
      notify("GSTIN must be 15 characters and PAN must be 10 characters.");
      return false;
    }
    return true;
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
      notify("Failed to load states");
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
      notify("Failed to load cities");
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
        notify("Failed to load countries");
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
    updateField("stateId", value);
    updateField("cityId", 0);
    setCities([]);
    if (value) {
      loadCity(Number(value));
    }
  };

  // =========================================================
  // CREATE COMPANY
  // =========================================================

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const payload: CreateCompanyDto = {
        ...formData,
        companyname: formData.companyname.trim(),
        registrationNumber: formData.registrationNumber.trim(),
        gstin: formData.gstin.trim().toUpperCase(),
        panNumber: formData.panNumber.trim().toUpperCase(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        website: formData.website.trim(),
        addressLine1: formData.addressLine1.trim(),
        addressLine2: formData.addressLine2?.trim() || "",
        postalCode: formData.postalCode.trim(),
      };

      await createCompany(payload);
      notify("Company created successfully");
      handleReset();
    } catch (error: unknown) {
      console.error("Create company error:", error);
      notify(error instanceof Error ? error.message : "Create company failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const handleReset = () => {
    setFormData(initialForm);
    setCities([]);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="p-2 p-md-4 bg-light min-vh-100">
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="mb-4">
          <h3 className="mb-1 fw-semibold text-dark">Company Management</h3>
          <p className="text-muted mb-0">Register a new company profile and manage corporate credentials.</p>
        </div>

        <Card className="border-0 shadow-sm rounded-4">
          <Card.Body className="p-3 p-md-4">
            <Form onSubmit={handleCreate} noValidate>
              <div className="d-flex align-items-center gap-2 mb-3">
                <ShopOutlined className="text-primary" />
                <strong className="text-dark">Company Profile & Credentials</strong>
              </div>

              <Row className="g-3">
                <Col xs={12} md={6}><Form.Group><Form.Label>Company Name</Form.Label><Form.Control required value={formData.companyname} onChange={(e) => updateField("companyname", e.target.value)} placeholder="Arogya Healthcare Pvt Ltd" /></Form.Group></Col>
                <Col xs={12} md={6}><Form.Group><Form.Label>Registration Number</Form.Label><Form.Control required value={formData.registrationNumber} onChange={(e) => updateField("registrationNumber", e.target.value)} placeholder="U85110KA2026PTC123456" /></Form.Group></Col>
                <Col xs={12} md={6}><Form.Group><Form.Label>GSTIN</Form.Label><Form.Control required maxLength={15} value={formData.gstin} onChange={(e) => updateField("gstin", e.target.value.toUpperCase())} placeholder="29ABCDE1234F1Z5" /></Form.Group></Col>
                <Col xs={12} md={6}><Form.Group><Form.Label>PAN Number</Form.Label><Form.Control required maxLength={10} value={formData.panNumber} onChange={(e) => updateField("panNumber", e.target.value.toUpperCase())} placeholder="ABCDE1234F" /></Form.Group></Col>
                <Col xs={12} md={4}><Form.Group><Form.Label>Email</Form.Label><Form.Control required type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="info@arogyahealth.in" /></Form.Group></Col>
                <Col xs={12} md={4}><Form.Group><Form.Label>Phone</Form.Label><Form.Control required value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+918040001122" /></Form.Group></Col>
                <Col xs={12} md={4}><Form.Group><Form.Label>Website</Form.Label><Form.Control type="url" value={formData.website} onChange={(e) => updateField("website", e.target.value)} placeholder="https://www.example.com" /></Form.Group></Col>
              </Row>

              <hr className="my-4" />
              <div className="d-flex align-items-center gap-2 mb-3"><EnvironmentOutlined className="text-primary" /><strong className="text-dark">Location & Address</strong></div>
              <Row className="g-3">
                <Col xs={12} md={6}><Form.Group><Form.Label>Address Line 1</Form.Label><Form.Control required as="textarea" rows={2} value={formData.addressLine1} onChange={(e) => updateField("addressLine1", e.target.value)} placeholder="100 Outer Ring Road, Bellandur" /></Form.Group></Col>
                <Col xs={12} md={6}><Form.Group><Form.Label>Address Line 2</Form.Label><Form.Control as="textarea" rows={2} value={formData.addressLine2 || ""} onChange={(e) => updateField("addressLine2", e.target.value)} placeholder="Additional address info" /></Form.Group></Col>
                <Col xs={12} sm={6} md={3}><Form.Group><Form.Label>Country</Form.Label><Form.Select required disabled={countryLoading} value={formData.countryId || ""} onChange={(e) => updateField("countryId", Number(e.target.value))}><option value="">{countryLoading ? "Loading..." : "Select country"}</option>{countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}</Form.Select></Form.Group></Col>
                <Col xs={12} sm={6} md={3}><Form.Group><Form.Label>State</Form.Label><Form.Select required disabled={stateLoading} value={formData.stateId || ""} onChange={(e) => handleStateChange(Number(e.target.value))}><option value="">{stateLoading ? "Loading..." : "Select state"}</option>{states.map((state) => <option key={state.id} value={state.id}>{state.name}</option>)}</Form.Select></Form.Group></Col>
                <Col xs={12} sm={6} md={3}><Form.Group><Form.Label>City</Form.Label><Form.Select required disabled={!formData.stateId || cityLoading} value={formData.cityId || ""} onChange={(e) => updateField("cityId", Number(e.target.value))}><option value="">{cityLoading ? "Loading..." : "Select city"}</option>{cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}</Form.Select></Form.Group></Col>
                <Col xs={12} sm={6} md={3}><Form.Group><Form.Label>Postal Code</Form.Label><Form.Control maxLength={10} value={formData.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} placeholder="560038" /></Form.Group></Col>
              </Row>

              <hr className="my-4" />
              <div className="d-flex align-items-center gap-2 mb-3"><SafetyCertificateOutlined className="text-primary" /><strong className="text-dark">Account Status</strong></div>
              <Form.Check type="switch" id="company-active" label="Company is active" checked={formData.isActive} onChange={(e) => updateField("isActive", e.target.checked)} />

              <hr className="my-4" />
              <div className="d-flex justify-content-end gap-2 flex-wrap">
                <Button variant="outline-secondary" type="button" onClick={handleReset} disabled={loading}>Clear Form</Button>
                <Button variant="primary" type="submit" disabled={loading} className="d-flex align-items-center gap-2">
                  {loading && <Spinner animation="border" size="sm" />}
                  <PlusOutlined /> Create Company
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}