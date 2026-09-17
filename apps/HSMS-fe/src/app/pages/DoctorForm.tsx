import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import {
  ApartmentOutlined,
  ArrowLeftOutlined,
  BankOutlined,
  MedicineBoxOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { CreateDoctorDto } from "../models/Doctor.dto";
import { createDoctor, getDoctorsdropdown } from "../services/Doctor.service";
import { getBranch } from "../services/Branch.service";
import { getDepartment } from "../services/Department.service";

interface DoctorFormProps {
  currentUserId?: number;
  onCancel: () => void;
  onSuccess: () => void;
}

interface OptionItem {
  id: number;
  label: string;
}

const initialForm: CreateDoctorDto = {
  branchId: 0,
  userId: 0,
  departmentId: undefined,
  specialization: "",
  licenseNumber: "",
  consultationFee: undefined,
  isActive: true,
};

const notify = (text: string) => window.alert(text);

export const DoctorForm: React.FC<DoctorFormProps> = ({ currentUserId = 1, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState<CreateDoctorDto>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [branches, setBranches] = useState<OptionItem[]>([]);
  const [departments, setDepartments] = useState<OptionItem[]>([]);
  const [users, setUsers] = useState<OptionItem[]>([]);

  const updateField = <K extends keyof CreateDoctorDto>(field: K, value: CreateDoctorDto[K]) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  useEffect(() => {
    const loadDropdownOptions = async () => {
      try {
        const [branchRes, deptRes, userRes] = await Promise.all([getBranch(), getDepartment(), getDoctorsdropdown()]);
        const rawUsers = (Array.isArray(userRes) ? userRes : userRes?.data || []) as Record<string, unknown>[];
        const rawBranches = (Array.isArray(branchRes) ? branchRes : branchRes?.data || []) as Record<string, unknown>[];
        const rawDepartments = (Array.isArray(deptRes) ? deptRes : deptRes?.data || []) as Record<string, unknown>[];
        setUsers(rawUsers.map((user) => ({ id: Number(user.docId ?? user.id), label: String(user.docname ?? user.name ?? user.fullName ?? `User #${user.id}`) })));
        setBranches(rawBranches.map((branch) => ({ id: Number(branch.id ?? branch.branchId ?? branch.branch_id), label: String(branch.branchName ?? branch.name ?? branch.title ?? `Branch #${branch.id}`) })));
        setDepartments(rawDepartments.map((department) => ({ id: Number(department.id ?? department.departmentId ?? department.department_id), label: String(department.name ?? `Department #${department.id}`) })));
      } catch (error) {
        console.error("Failed to load options:", error);
        notify("Failed to load dropdown options.");
      }
    };
    loadDropdownOptions();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.userId || !formData.branchId) {
      notify("Please select a user account and branch.");
      return;
    }
    setSubmitting(true);
    try {
      await createDoctor({ ...formData, createBy: currentUserId });
      notify("Doctor record created successfully");
      onSuccess();
    } catch (error) {
      console.error("Form submit error:", error);
      notify("Failed to create doctor record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="doctor-form-page p-2 p-md-4 bg-light min-vh-100">
      <Card className="doctor-form-card border-0 shadow-sm rounded-4 mx-auto" style={{ maxWidth: 1000 }}>
        <Card.Body className="p-3 p-md-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <div className="d-flex align-items-center gap-3">
              <div className="doctor-form-icon"><MedicineBoxOutlined /></div>
              <div><h4 className="mb-1 fw-bold text-dark">Add New Doctor</h4><p className="text-muted mb-0 small">Fill in the required fields to link a user account as a doctor.</p></div>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" type="button" onClick={onCancel}><ArrowLeftOutlined /> Back</Button>
              <Button variant="primary" type="submit" form="doctor-form" disabled={submitting} className="d-flex align-items-center gap-2">{submitting && <Spinner animation="border" size="sm" />}<SaveOutlined /> Save Doctor</Button>
            </div>
          </div>

          <Form id="doctor-form" onSubmit={handleSubmit}>
            <div className="form-section-heading mb-3"><span className="section-icon"><UserOutlined /></span><div><strong>Required Associations</strong><small>Link the doctor to a user account and branch</small></div></div>
            <Row className="g-3">
              <Col xs={12} md={6}><Form.Group><Form.Label><UserOutlined /> Select User Account</Form.Label><Form.Select required value={formData.userId || ""} onChange={(e) => updateField("userId", Number(e.target.value))}><option value="">Select user</option>{users.map((user) => <option key={user.id} value={user.id}>{user.label}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={12} md={6}><Form.Group><Form.Label><BankOutlined /> Branch Location</Form.Label><Form.Select required value={formData.branchId || ""} onChange={(e) => updateField("branchId", Number(e.target.value))}><option value="">Select branch</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.label}</option>)}</Form.Select></Form.Group></Col>
            </Row>

            <hr className="my-4" />
            <div className="form-section-heading mb-3"><span className="section-icon"><ApartmentOutlined /></span><div><strong>Doctor Details</strong><small>Optional practice and qualification information</small></div></div>
            <Row className="g-3">
              <Col xs={12} md={6}><Form.Group><Form.Label>Department</Form.Label><Form.Select value={formData.departmentId || ""} onChange={(e) => updateField("departmentId", e.target.value ? Number(e.target.value) : undefined)}><option value="">Select department</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.label}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={12} md={6}><Form.Group><Form.Label>Specialization</Form.Label><Form.Control value={formData.specialization || ""} onChange={(e) => updateField("specialization", e.target.value)} placeholder="e.g. Cardiology, Pediatrics" /></Form.Group></Col>
              <Col xs={12} md={6}><Form.Group><Form.Label>License Number</Form.Label><Form.Control value={formData.licenseNumber || ""} onChange={(e) => updateField("licenseNumber", e.target.value)} placeholder="MED-XXXXX" /></Form.Group></Col>
              <Col xs={12} md={6}><Form.Group><Form.Label>Consultation Fee (INR)</Form.Label><Form.Control type="number" min={0} step="0.01" value={formData.consultationFee ?? ""} onChange={(e) => updateField("consultationFee", e.target.value ? Number(e.target.value) : undefined)} placeholder="0.00" /></Form.Group></Col>
            </Row>

            <hr className="my-4" />
            <div className="setting-tile d-flex justify-content-between align-items-center"><div><strong className="d-block text-dark">Is Active?</strong><small className="text-muted">Active doctors are visible in operational selection lists.</small></div><Form.Check type="switch" checked={formData.isActive} onChange={(e) => updateField("isActive", e.target.checked)} /></div>
            <hr className="my-4" />
            <div className="d-flex justify-content-end gap-2 flex-wrap"><Button variant="outline-secondary" type="button" onClick={onCancel}>Cancel</Button><Button variant="primary" type="submit" disabled={submitting} className="d-flex align-items-center gap-2">{submitting && <Spinner animation="border" size="sm" />}<SaveOutlined /> Create Doctor Profile</Button></div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DoctorForm;
