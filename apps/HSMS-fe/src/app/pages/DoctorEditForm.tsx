import { useEffect, useState, useCallback } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Row,
  Col,
  Button,
  message,
  Divider,
  Typography,
  Card,
  Space,
  Spin,
} from "antd";

import {
  MedicineBoxOutlined,
  DollarOutlined,
  BankOutlined,
  AppstoreOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

import { useParams, useNavigate } from "react-router-dom";

import { UpdateDoctorDto, DoctorDto } from "../models/Doctor.dto";
import { updateDoctor, GetDoctobyID } from "../services/Doctor.service";
import { getBranch } from "../services/Branch.service";
import { getDepartment } from "../services/Department.service";

const { Text, Title } = Typography;

interface BranchOption {
  id: number;
  branchName: string;
}

interface DepartmentOption {
  id: number;
  name: string;
}

interface DoctorEditFormProps {
  currentUserId?: number;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function DoctorEditForm({
  currentUserId,
  onCancel,
  onSuccess,
}: DoctorEditFormProps) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const doctorId = id ? parseInt(id, 10) : currentUserId;

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);

  const fetchDoctor = useCallback(
    async (idToFetch: number) => {
      try {
        const response = await GetDoctobyID(idToFetch);

     
    const doctorData = (response as any)?.message ?? null;

if (!doctorData || typeof doctorData !== "object" || !("id" in doctorData)) {
  throw new Error("Doctor data not found");
}
        const doctor: DoctorDto = doctorData as DoctorDto;
 
        form.setFieldsValue({
          id: doctor.id,
          userId: doctor.userId,
          doctorName: doctor.doctorName,
          specialization: doctor.specialization ?? "",
          licenseNumber: doctor.licenseNumber ?? "",
          consultationFee: doctor.consultationFee,
          branchId: doctor.branchId,
          departmentId: doctor.departmentId,
          isActive: doctor.isActive ?? true,
        });
      } catch (error) {
        console.error("Failed to fetch doctor profile:", error);
        message.error("Failed to load doctor profile.");
      }
    },
    [form]
  );

  const fetchBranches = useCallback(async () => {
    try {
      const response = await getBranch();
      const branchData =
        response?.data?.data ?? response?.data ?? response ?? [];
      setBranches(Array.isArray(branchData) ? branchData : []);
    } catch (error) {
      console.error("Failed to load branches:", error);
      message.error("Failed to load branches.");
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await getDepartment();
      const departmentData =
        response?.data?.data ?? response?.data ?? response ?? [];
      setDepartments(Array.isArray(departmentData) ? departmentData : []);
    } catch (error) {
      console.error("Failed to load departments:", error);
      message.error("Failed to load departments.");
    }
  }, []);

  useEffect(() => {
    if (!doctorId || Number.isNaN(doctorId)) {
      message.error("Invalid doctor ID provided.");
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetchDoctor(doctorId),
      fetchBranches(),
      fetchDepartments(),
    ]).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [doctorId, fetchDoctor, fetchBranches, fetchDepartments]);

  const handleSubmit = async (values: any) => {
    if (!doctorId) {
      message.error("Doctor ID missing for save operation.");
      return;
    }

    setSubmitting(true);

    try {
      const updateData: UpdateDoctorDto = {
        id: doctorId,
        specialization: values.specialization,
        licenseNumber: values.licenseNumber,
        consultationFee: values.consultationFee,
        branchId: values.branchId,
        departmentId: values.departmentId,
        isActive: values.isActive,
        updateBy: currentUserId,
      };

      await updateDoctor(updateData);
      message.success("Doctor details updated successfully.");

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/doctor");
      }
    } catch (error) {
      console.error("Failed to update doctor details:", error);
      message.error("Failed to update doctor details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      navigate("/doctor");
    } else {
      navigate("/doctor");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Spin size="large" tip="Loading doctor profile..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
          <Col>
            <Space size="middle">
              <MedicineBoxOutlined style={{ fontSize: 28, color: "#1890ff" }} />
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  Edit Doctor Profile
                </Title>
                <Text type="secondary">Update doctor profile and details</Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Button icon={<ArrowLeftOutlined />} onClick={handleCancel}>
              Back
            </Button>
          </Col>
        </Row>

        <Divider />

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="userId" hidden>
            <Input />
          </Form.Item>

          <Title level={4}>
            <UserOutlined /> Basic Information
          </Title>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Doctor Name"
                name="doctorName"
                rules={[{ required: true, message: "Please enter doctor name" }]}
              >
                <Input placeholder="Enter doctor name" readOnly />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Title level={4}>
            <MedicineBoxOutlined /> Professional Information
          </Title>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Specialization"
                name="specialization"
              >
                <Input placeholder="e.g. Obstetrics & Gynaecology" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="License Number"
                name="licenseNumber"
              >
                <Input
                  prefix={<SafetyCertificateOutlined />}
                  placeholder="Enter medical license number"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Consultation Fee" name="consultationFee">
  <InputNumber
    min={0}
    style={{ width: "100%" }}
    prefix="₹"
    placeholder="Enter consultation fee"
    formatter={(value) =>
      value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
    }
    parser={(value) => value?.replace(/₹\s?|(,*)/g, "") || ""}
  />
</Form.Item>
            </Col>
          </Row>

          <Divider />

          <Title level={4}>
            <BankOutlined /> Organization Details
          </Title>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Branch"
                name="branchId"
                rules={[{ required: true, message: "Please select branch" }]}
              >
                <Select
                  placeholder="Select branch"
                  showSearch
                  optionFilterProp="label"
                  fieldNames={{ label: "branchName", value: "id" }}
                  options={branches}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Department"
                name="departmentId"
                rules={[{ required: true, message: "Please select department" }]}
              >
                <Select
                  placeholder="Select department"
                  showSearch
                  optionFilterProp="label"
                  fieldNames={{ label: "name", value: "id" }}
                  options={departments}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Title level={4}>
            <AppstoreOutlined /> Account Status
          </Title>

          <Form.Item label="Status" name="isActive" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <Divider />

          <Row justify="end">
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                icon={<SaveOutlined />}
              >
                Save Changes
              </Button>
            </Space>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default DoctorEditForm;