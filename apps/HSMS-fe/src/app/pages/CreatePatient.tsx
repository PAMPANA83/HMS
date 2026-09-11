import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Switch,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Breadcrumb,
  Space,
  message,
  ConfigProvider,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { CreatePatientDto,DoctorOption} from "../models/Patients.dto";
// FIXED: Corrected typos in service imports
import { createPatiemts} from "../services/Patients.service";
import { getDoctorsResdropdown } from "../services/Doctor.service";
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
dayjs.extend(utc);
export function CreatePatient() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState<boolean>(false);

  // Load Doctors dropdown options
  useEffect(() => {
    setLoadingDoctors(true);
    getDoctorsResdropdown()
      .then((res: any) => {
        const list = Array.isArray(res) ? res : res?.data ?? [];
        setDoctors(list);
      })
      .catch((err: any) => {
        console.error("Failed to load doctors:", err);
        message.error("Failed to load doctor list.");
      })
      .finally(() => setLoadingDoctors(false));
  }, []);

  // Submit Handler
  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const payload: CreatePatientDto = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
        gender: values.gender,
        phoneNumber: values.phoneNumber.trim(),
        email: values.email?.trim() || undefined,
        doctorId: values.doctorId,
        appointmentDateTime: values.appointmentDateTime.toISOString(),
        reasonForVisit: values.reasonForVisit?.trim() || undefined,
        isActive: values.isActive ?? true,
      };

      await createPatiemts(payload);
      message.success("Patient created successfully!");
      navigate("/patient");
    } catch (error: any) {
      console.error("Error creating patient:", error);
      message.error(
        error.response?.data?.message || "Failed to create patient record."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 6,
          colorPrimary: "#2563eb",
        },
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px" }}>
        {/* Navigation Breadcrumb */}
        <Breadcrumb
          style={{ marginBottom: 16 }}
          items={[
            { title: <Link to="/patient">Patients</Link> },
            { title: "Add New Patient" },
          ]}
        />

        {/* Form Container Card */}
        <Card
          bordered={false}
          style={{
            borderRadius: 12,
            boxShadow:
              "0 1px 3px rgba(16, 24, 40, 0.05), 0 1px 2px rgba(16, 24, 40, 0.06)",
          }}
          bodyStyle={{ padding: "24px 32px" }}
        >
          {/* Header Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: 16,
            }}
          >
            <div>
              <Title level={4} style={{ margin: 0, color: "#0f172a" }}>
                Add New Patient
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Fill in the details below to register a new patient and book an appointment
              </Text>
            </div>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/patient")}
            >
              Back to List
            </Button>
          </div>

          {/* Form Controls */}
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ isActive: true }}
            requiredMark="optional"
          >
            {/* Personal Details Section */}
            <Title level={5} style={{ color: "#334155", marginBottom: 16 }}>
              Personal Information
            </Title>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[
                    { required: true, message: "First name is required" },
                    { max: 50, message: "Max 50 characters allowed" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="e.g. Rahul"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[
                    { required: true, message: "Last name is required" },
                    { max: 50, message: "Max 50 characters allowed" },
                  ]}
                >
                  <Input placeholder="e.g. Sharma" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="dateOfBirth"
                  label="Date of Birth"
                  rules={[{ required: true, message: "Date of birth is required" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    placeholder="Select DOB"
                    disabledDate={(current) =>
                      current && current > dayjs().endOf("day")
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[{ required: true, message: "Gender is required" }]}
                >
                  <Select placeholder="Select gender">
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="phoneNumber"
                  label="Phone Number"
                  rules={[
                    { required: true, message: "Phone number is required" },
                    { max: 15, message: "Max 15 characters allowed" },
                    {
                      pattern: /^[0-9+\-\s()]+$/,
                      message: "Enter a valid phone number",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="e.g. +91 9876543210"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { type: "email", message: "Enter a valid email" },
                    { max: 100, message: "Max 100 characters allowed" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="e.g. rahul.sharma@example.com"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Appointment & Medical Info Section */}
            <Title
              level={5}
              style={{ color: "#334155", marginTop: 12, marginBottom: 16 }}
            >
              Appointment & Consultation Details
            </Title>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="doctorId"
                  label="Assigned Doctor"
                  rules={[{ required: true, message: "Doctor is required" }]}
                >
                  <Select
                    placeholder="Select doctor"
                    loading={loadingDoctors}
                    showSearch
                    optionFilterProp="children"
                  >
                    {doctors.map((doc) => (
                      <Option key={doc.docId} value={doc.docId}>
                        {doc.docname} 
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="appointmentDateTime"
                  label="Appointment Date & Time"
                  rules={[{ required: true, message: "Appointment time is required" }]}
                >
                  <DatePicker
                    showTime={{ format: "HH:mm" }}
                    format="DD/MM/YYYY HH:mm"
                    style={{ width: "100%" }}
                    placeholder="Select date and time"
                    disabledDate={(current) =>
                        current && current < dayjs().startOf("day")
                    }
                    />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="reasonForVisit"
              label="Reason for Visit"
              rules={[{ max: 255, message: "Max 255 characters allowed" }]}
            >
              <TextArea
                rows={3}
                placeholder="Brief description of symptoms or consultation reason..."
                maxLength={255}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="isActive"
              label="Active Status"
              valuePropName="checked"
            >
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>

            {/* Submit Action Buttons */}
            <div style={{ textAlign: "right", marginTop: 24 }}>
              <Space>
                <Button onClick={() => navigate("/patient")}>Cancel</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={submitting}
                >
                  Save Patient Record
                </Button>
              </Space>
            </div>
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  );
}

export default CreatePatient;