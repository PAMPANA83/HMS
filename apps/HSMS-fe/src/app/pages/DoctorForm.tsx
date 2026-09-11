import React, { useEffect, useState } from "react";
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
} from "antd";
import {
  MedicineBoxOutlined,
  UserOutlined,
  IdcardOutlined,
  DollarOutlined,
  BankOutlined,
  AppstoreOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { CreateDoctorDto } from "../models/Doctor.dto";
import { createDoctor, getDoctorsdropdown } from "../services/Doctor.service";
import { getBranch } from "../services/Branch.service";
import { getDepartment } from "../services/Department.service";

const { Text, Title } = Typography;

interface DoctorFormProps {
  currentUserId?: number; // Logged-in user ID for createBy
  onCancel: () => void;
  onSuccess: () => void;
}
  const storedUser = localStorage.getItem("user");
export const DoctorForm: React.FC<DoctorFormProps> = ({

  currentUserId = storedUser ? JSON.parse(storedUser).userId : 1, // Default to 1 if not provided
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [branches, setBranches] = useState<{ id: number; branchName: string }[]>([]);
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [users, setUsers] = useState<{ id: number; docname: string }[]>([]);

  useEffect(() => {
    loadDropdownOptions();
    form.resetFields();
    form.setFieldsValue({ isActive: true });
  }, [form]);

  const loadDropdownOptions = async () => {
    try {
      const [branchRes, deptRes, userRes] = await Promise.all([
        getBranch(),
        getDepartment(),
        getDoctorsdropdown(),
      ]);

      const rawUsers = Array.isArray(userRes) ? userRes : userRes?.data || [];
      const rawBranches = Array.isArray(branchRes) ? branchRes : branchRes?.data || [];
      const rawDepartments = Array.isArray(deptRes) ? deptRes : deptRes?.data || [];

      setUsers(
        rawUsers.map((u: any) => ({
          id: Number(u.docId ?? u.id),
          docname: u.docname ?? u.name ?? u.fullName ?? `User #${u.id}`,
        }))
      );

      setBranches(
        rawBranches.map((b: any) => ({
          id: Number(b.id ?? b.branchId ?? b.branch_id),
          branchName: b.branchName ?? b.name ?? b.title ?? `Branch #${b.id}`,
        }))
      );

      setDepartments(
        rawDepartments.map((d: any) => ({
          id: Number(d.id ?? d.departmentId ?? d.department_id),
          name: d.name ?? `Dept #${d.id}`,
        }))
      );
    } catch (error) {
      console.error("Failed to load options:", error);
      message.error("Failed to load dropdown options.");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const createPayload: CreateDoctorDto = {
        branchId: values.branchId,
        userId: values.userId,
        departmentId: values.departmentId,
        specialization: values.specialization,
        licenseNumber: values.licenseNumber,
        consultationFee: values.consultationFee,
        isActive: values.isActive ?? true,
        createBy: currentUserId,
      };

      await createDoctor(createPayload);
      message.success("Doctor record created successfully");
      onSuccess();
    } catch (error: any) {
      if (error?.errorFields) return;
      console.error("Form submit error:", error);
      message.error("Failed to create doctor record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: "16px",
        boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)",
      }}
      bodyStyle={{ padding: "28px" }}
    >
      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "10px",
              background: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MedicineBoxOutlined style={{ color: "#3b82f6", fontSize: "22px" }} />
          </div>
          <div>
            <Title level={4} style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>
              Add New Doctor
            </Title>
            <Text type="secondary" style={{ fontSize: "13px" }}>
              Fill in the required fields to link a user account as a doctor.
            </Text>
          </div>
        </div>

        {/* Header Action Buttons */}
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={onCancel} style={{ borderRadius: "8px", fontWeight: 500 }}>
            Back
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={submitting}
            onClick={handleSubmit}
            style={{
              borderRadius: "8px",
              fontWeight: 500,
              background: "#3b82f6",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)",
            }}
          >
            Save Doctor
          </Button>
        </Space>
      </div>

      <Form form={form} layout="vertical" requiredMark="optional">
        {/* Core Mandatory Relations */}
        <Text strong style={{ color: "#334155", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Required Associations
        </Text>
        <Divider style={{ margin: "8px 0 20px 0" }} />

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="userId"
              label={<Text strong style={{ color: "#475569" }}>Select User Account</Text>}
              rules={[{ required: true, message: "Please select a user account" }]}
            >
              <Select
                showSearch
                size="large"
                placeholder="Select User"
                suffixIcon={<UserOutlined style={{ color: "#94a3b8" }} />}
                filterOption={(input, option) =>
                  String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={users.map((u) => ({
                  value: u.id,
                  label: u.docname,
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="branchId"
              label={<Text strong style={{ color: "#475569" }}>Branch Location</Text>}
              rules={[{ required: true, message: "Please select a branch" }]}
            >
              <Select
                showSearch
                size="large"
                placeholder="Select Branch"
                suffixIcon={<BankOutlined style={{ color: "#94a3b8" }} />}
                filterOption={(input, option) =>
                  String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={branches.map((b) => ({
                  value: b.id,
                  label: b.branchName,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Practice & Qualifications */}
        <Text strong style={{ color: "#334155", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Doctor Details (Optional)
        </Text>
        <Divider style={{ margin: "8px 0 20px 0" }} />

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="departmentId"
              label={<Text strong style={{ color: "#475569" }}>Department</Text>}
            >
              <Select
                showSearch
                allowClear
                size="large"
                placeholder="Select Department"
                suffixIcon={<AppstoreOutlined style={{ color: "#94a3b8" }} />}
                filterOption={(input, option) =>
                  String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={departments.map((d) => ({
                  value: d.id,
                  label: d.name,
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="specialization"
              label={<Text strong style={{ color: "#475569" }}>Specialization</Text>}
            >
              <Input
                placeholder="e.g. Cardiology, Pediatrics"
                size="large"
                style={{ borderRadius: "8px" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="licenseNumber"
              label={<Text strong style={{ color: "#475569" }}>License Number</Text>}
            >
              <Input
                prefix={<IdcardOutlined style={{ color: "#94a3b8" }} />}
                placeholder="MED-XXXXX"
                size="large"
                style={{ borderRadius: "8px", fontFamily: "monospace" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
  name="consultationFee"
  label={<Text strong style={{ color: "#475569" }}>Consultation Fee (₹)</Text>}
>
  <InputNumber
    style={{ width: "100%" }}
    min={0}
    prefix="₹"
    placeholder="0.00"
    formatter={(value) =>
      value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
    }
    parser={(value) => Number(value?.replace(/₹\s?|(,*)/g, "") || 0)}
  />
</Form.Item>
          </Col>
        </Row>

        {/* Status */}
        <Divider style={{ margin: "8px 0 20px 0" }} />
        <Row justify="space-between" align="middle">
          <Col>
            <div>
              <Text strong style={{ color: "#1e293b" }}>Is Active?</Text>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                Active doctors are visible in operational selection lists.
              </div>
            </div>
          </Col>
          <Col>
            <Form.Item name="isActive" valuePropName="checked" style={{ margin: 0 }}>
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </Col>
        </Row>

        {/* Bottom Actions */}
        <Divider style={{ margin: "24px 0 20px 0" }} />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Button onClick={onCancel} style={{ borderRadius: "8px", fontWeight: 500 }}>
            Cancel
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={submitting}
            onClick={handleSubmit}
            style={{
              borderRadius: "8px",
              fontWeight: 500,
              background: "#3b82f6",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)",
            }}
          >
            Create Doctor Profile
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default DoctorForm;