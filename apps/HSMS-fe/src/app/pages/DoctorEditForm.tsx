import { useEffect, useState, useCallback } from "react";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  BankOutlined,
  MedicineBoxOutlined,
  SaveOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { UpdateDoctorDto, DoctorDto } from "../models/Doctor.dto";
import { updateDoctor, GetDoctobyID } from "../services/Doctor.service";
import { getBranch } from "../services/Branch.service";
import { getDepartment } from "../services/Department.service";

interface BranchOption { id: number; branchName: string; }
interface DepartmentOption { id: number; name: string; }
interface DoctorEditFormProps { currentUserId?: number; onCancel?: () => void; onSuccess?: () => void; }
interface EditFormState { doctorName: string; userId: number; specialization: string; licenseNumber: string; consultationFee?: number; branchId: number; departmentId?: number; isActive: boolean; }

const emptyForm: EditFormState = { doctorName: "", userId: 0, specialization: "", licenseNumber: "", consultationFee: undefined, branchId: 0, departmentId: undefined, isActive: true };
const notify = (text: string) => window.alert(text);

export function DoctorEditForm({ currentUserId, onCancel, onSuccess }: DoctorEditFormProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const doctorId = id ? Number.parseInt(id, 10) : currentUserId;
  const [formData, setFormData] = useState<EditFormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);

  const updateField = <K extends keyof EditFormState>(field: K, value: EditFormState[K]) => setFormData((previous) => ({ ...previous, [field]: value }));

  const fetchDoctor = useCallback(async (idToFetch: number) => {
    try {
      const response = await GetDoctobyID(idToFetch);
      const responseObject = response && typeof response === "object" ? response as { message?: unknown; data?: unknown } : {};
      const candidate = responseObject.message ?? responseObject.data;
      if (!candidate || typeof candidate !== "object" || !("id" in candidate)) throw new Error("Doctor data not found");
      const doctor = candidate as DoctorDto;
      setFormData({ doctorName: doctor.doctorName || "", userId: doctor.userId, specialization: doctor.specialization || "", licenseNumber: doctor.licenseNumber || "", consultationFee: doctor.consultationFee, branchId: doctor.branchId, departmentId: doctor.departmentId, isActive: doctor.isActive ?? true });
    } catch (error) {
      console.error("Failed to fetch doctor profile:", error);
      notify("Failed to load doctor profile.");
    }
  }, []);

  const fetchBranches = useCallback(async () => {
    try {
      const response = await getBranch();
      const data = response?.data?.data ?? response?.data ?? response ?? [];
      setBranches(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load branches:", error);
      notify("Failed to load branches.");
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await getDepartment();
      const data = response?.data?.data ?? response?.data ?? response ?? [];
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load departments:", error);
      notify("Failed to load departments.");
    }
  }, []);

  useEffect(() => {
    if (!doctorId || Number.isNaN(doctorId)) {
      notify("Invalid doctor ID provided.");
      setLoading(false);
      return;
    }
    let mounted = true;
    Promise.all([fetchDoctor(doctorId), fetchBranches(), fetchDepartments()]).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [doctorId, fetchDoctor, fetchBranches, fetchDepartments]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!doctorId || !formData.branchId || !formData.departmentId) { notify("Please select branch and department."); return; }
    setSubmitting(true);
    try {
      const updateData: UpdateDoctorDto = { id: doctorId, specialization: formData.specialization, licenseNumber: formData.licenseNumber, consultationFee: formData.consultationFee, branchId: formData.branchId, departmentId: formData.departmentId, isActive: formData.isActive, updateBy: currentUserId };
      await updateDoctor(updateData);
      notify("Doctor details updated successfully.");
      onSuccess ? onSuccess() : navigate("/doctor");
    } catch (error) {
      console.error("Failed to update doctor details:", error);
      notify("Failed to update doctor details.");
    } finally { setSubmitting(false); }
  };

  const handleCancel = () => { onCancel?.(); navigate("/doctor"); };

  if (loading) return <div className="doctor-edit-page d-flex justify-content-center align-items-center min-vh-100 bg-light"><Spinner animation="border" variant="primary" /></div>;

  return (
    <div className="doctor-edit-page p-2 p-md-4 bg-light min-vh-100"><Card className="doctor-edit-card border-0 shadow-sm rounded-4 mx-auto" style={{ maxWidth: 1100 }}><Card.Body className="p-3 p-md-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4"><div className="d-flex align-items-center gap-3"><div className="doctor-form-icon"><MedicineBoxOutlined /></div><div><h3 className="mb-1 fw-bold text-dark">Edit Doctor Profile</h3><p className="text-muted mb-0">Update doctor profile and details.</p></div></div><Button variant="outline-secondary" onClick={handleCancel}><ArrowLeftOutlined /> Back</Button></div>
      <Form onSubmit={handleSubmit}>
        <div className="form-section-heading mb-3"><span className="section-icon"><MedicineBoxOutlined /></span><div><strong>Basic Information</strong><small>Doctor identity and account details</small></div></div>
        <Row className="g-3"><Col xs={12} md={6}><Form.Group><Form.Label>Doctor Name</Form.Label><Form.Control value={formData.doctorName} readOnly /></Form.Group></Col><Col xs={12} md={6}><Form.Group><Form.Label>User ID</Form.Label><Form.Control value={formData.userId || ""} readOnly /></Form.Group></Col></Row>
        <hr className="my-4" /><div className="form-section-heading mb-3"><span className="section-icon"><SafetyCertificateOutlined /></span><div><strong>Professional Information</strong><small>Specialization, license, and consultation fee</small></div></div>
        <Row className="g-3"><Col xs={12} md={6}><Form.Group><Form.Label>Specialization</Form.Label><Form.Control value={formData.specialization} onChange={(e) => updateField("specialization", e.target.value)} placeholder="e.g. Cardiology" /></Form.Group></Col><Col xs={12} md={6}><Form.Group><Form.Label>License Number</Form.Label><Form.Control value={formData.licenseNumber} onChange={(e) => updateField("licenseNumber", e.target.value)} placeholder="Medical license number" /></Form.Group></Col><Col xs={12} md={6}><Form.Group><Form.Label>Consultation Fee (INR)</Form.Label><Form.Control type="number" min={0} step="0.01" value={formData.consultationFee ?? ""} onChange={(e) => updateField("consultationFee", e.target.value ? Number(e.target.value) : undefined)} placeholder="0.00" /></Form.Group></Col></Row>
        <hr className="my-4" /><div className="form-section-heading mb-3"><span className="section-icon"><BankOutlined /></span><div><strong>Organization Details</strong><small>Assign the doctor to a branch and department</small></div></div>
        <Row className="g-3"><Col xs={12} md={6}><Form.Group><Form.Label>Branch</Form.Label><Form.Select required value={formData.branchId || ""} onChange={(e) => updateField("branchId", Number(e.target.value))}><option value="">Select branch</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.branchName}</option>)}</Form.Select></Form.Group></Col><Col xs={12} md={6}><Form.Group><Form.Label><AppstoreOutlined /> Department</Form.Label><Form.Select required value={formData.departmentId || ""} onChange={(e) => updateField("departmentId", e.target.value ? Number(e.target.value) : undefined)}><option value="">Select department</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</Form.Select></Form.Group></Col></Row>
        <hr className="my-4" /><div className="setting-tile d-flex justify-content-between align-items-center"><div><strong className="d-block text-dark">Account Status</strong><small className="text-muted">Active doctors are visible in operational selection lists.</small></div><Form.Check type="switch" checked={formData.isActive} onChange={(e) => updateField("isActive", e.target.checked)} /></div>
        <hr className="my-4" /><div className="d-flex justify-content-end gap-2 flex-wrap"><Button variant="outline-secondary" type="button" onClick={handleCancel}>Cancel</Button><Button variant="primary" type="submit" disabled={submitting} className="d-flex align-items-center gap-2">{submitting && <Spinner animation="border" size="sm" />}<SaveOutlined /> Save Changes</Button></div>
      </Form>
    </Card.Body></Card></div>
  );
}

export default DoctorEditForm;
