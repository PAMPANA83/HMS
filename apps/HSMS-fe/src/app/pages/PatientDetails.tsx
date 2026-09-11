import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Tag,
  Space,
  Button,
  Descriptions,
  Spin,
  Result,
  Divider,
  Tabs,
  Avatar,
  message,
  ConfigProvider,
  Row,
  Col,
  Table,
  Badge,
  Input,
  Select,
  Modal,
  Form,
  DatePicker,
  Tooltip,
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  IdcardOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import {
  PatientAppointment,
  AppointmentData,
  CreateAppointmentDto,
  DoctorOption,
} from "../models/Patients.dto";
import {
  GetpatientbyID,
  GetAppointmentpatientbyID,
  createPatiemtsAppoint,
} from "../services/Patients.service";
import { getDoctorsResdropdown } from "../services/Doctor.service";

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = "Asia/Kolkata";
const { Title, Text } = Typography;
const { TextArea } = Input;

const calculateAge = (dobString?: string): number => {
  if (!dobString) return 0;
  const dob = dayjs(dobString);
  return dob.isValid() ? dayjs().diff(dob, "year") : 0;
};

export function PatientDetails() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [patient, setPatient] = useState<PatientAppointment | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientAppointment | null>(null);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [doctorsLoading, setDoctorsLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Search & Filter States
  const [searchText, setSearchText] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch Patient Details
  const fetchPatientDetails = useCallback(async () => {
    if (!patientId) {
      setError("No patient ID provided in URL.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await GetpatientbyID(Number(patientId));
      const responseData = response as any;

      let data =
        responseData?.message ??
        responseData?.data ??
        responseData;

      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          // Keep as is if parsing fails
        }
      }

      if (data && (data.patientId || data.id)) {
        setPatient(data);
      } else {
        setError("Patient record not found.");
      }
    } catch (err: any) {
      console.error("Error fetching patient details:", err);
      setError(err?.message || "Failed to load patient details.");
      message.error("Failed to load patient information.");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const fetchDoctors = useCallback(async () => {
    setDoctorsLoading(true);
    try {
      const response = await getDoctorsResdropdown();
      const listData = Array.isArray(response)
        ? response
        : response?.data?.data ?? response?.data ?? response?.message ?? [];

      setDoctors(Array.isArray(listData) ? listData : []);
    } catch (error) {
      console.error("Failed to load doctors:", error);
      message.error("Failed to load doctors list.");
    } finally {
      setDoctorsLoading(false);
    }
  }, []);

  // Fetch Patient Appointment History
  const fetchAppointmentHistory = useCallback(async () => {
    if (!patientId) return;

    try {
      setAppointmentsLoading(true);
      const response = await GetAppointmentpatientbyID(Number(patientId));
      const responseData = response as any;

      let data =
        responseData?.message ??
        responseData?.data?.message ??
        responseData?.data ??
        responseData;

      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          // Keep as is if parsing fails
        }
      }

      const list: AppointmentData[] = Array.isArray(data) ? data : data ? [data] : [];
      setAppointments(list);
    } catch (err: any) {
      console.error("Error fetching appointment history:", err);
      message.error("Failed to load appointment history.");
    } finally {
      setAppointmentsLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchPatientDetails();
    fetchAppointmentHistory();
  }, [fetchPatientDetails, fetchAppointmentHistory]);

  const handleOpenAppointmentModal = (targetPatient: PatientAppointment) => {
    setSelectedPatient(targetPatient);
    setIsModalOpen(true);
    fetchDoctors();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
    form.resetFields();
  };

  const handleBookAppointment = async (values: {
    doctorId: number;
    appointmentDateTime: Dayjs;
    reasonForVisit?: string;
  }) => {
    const targetId =
      selectedPatient?.patientId ??
      (selectedPatient as any)?.id ??
      (selectedPatient as any)?._id;

    if (!targetId) {
      message.error("Patient ID is missing.");
      return;
    }

    const payload: CreateAppointmentDto = {
      patientId: Number(targetId),
      doctorId: Number(values.doctorId),
      appointmentDateTime: values.appointmentDateTime.toISOString(),
      reasonForVisit: values.reasonForVisit?.trim() || "",
    };

    try {
      setSubmitting(true);
      await createPatiemtsAppoint(payload);
      message.success("Appointment booked successfully!");
      handleCloseModal();
      fetchAppointmentHistory();
    } catch (error: any) {
      console.error("Failed to book appointment:", error);
      message.error(
        error?.response?.data?.message || "Failed to book appointment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const hasActiveAppointment = useMemo(() => {
    return appointments.some((item) => {
      const status = item.status?.toUpperCase();
      return status === "SCHEDULED" || status === "CONFIRMED";
    });
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const matchesSearch =
        item.doctorName?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.reasonForVisit?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        item.status?.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchText, statusFilter]);

  const getStatusTag = (status: string) => {
    const statusUpper = status?.toUpperCase() || "";
    switch (statusUpper) {
      case "SCHEDULED":
      case "CONFIRMED":
        case "CHECKED-IN":
        return (
          <Tag
            color="processing"
            style={{ borderRadius: "12px", padding: "2px 10px", fontWeight: 500 }}
          >
            {status}
          </Tag>
        );
      case "COMPLETED":
        return (
          <Tag
            color="success"
            style={{ borderRadius: "12px", padding: "2px 10px", fontWeight: 500 }}
          >
            {status}
          </Tag>
        );
      case "CANCELLED":
      case "CANCELED":
        return (
          <Tag
            color="error"
            style={{ borderRadius: "12px", padding: "2px 10px", fontWeight: 500 }}
          >
            {status}
          </Tag>
        );
      default:
        return (
          <Tag
            color="default"
            style={{ borderRadius: "12px", padding: "2px 10px", fontWeight: 500 }}
          >
            {status || "N/A"}
          </Tag>
        );
    }
  };

  const appointmentColumns: ColumnsType<AppointmentData> = [
    {
      title: "Doctor Name",
      dataIndex: "doctorName",
      key: "doctorName",
      render: (text: string) => (
        <Space>
          <Avatar
            size="small"
            icon={<UserOutlined />}
            style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}
          />
          <Text strong style={{ color: "#1e293b" }}>
            {text ? `Dr. ${text}` : "—"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Appointment Date & Time (IST)",
      dataIndex: "appointmentDateTime",
      key: "appointmentDateTime",
      sorter: (a, b) =>
        dayjs(a.appointmentDateTime).unix() - dayjs(b.appointmentDateTime).unix(),
      render: (dateTime: string) => {
        if (!dateTime) return "—";
        const dateObj = dayjs(dateTime).tz(TIMEZONE);
        return (
          <Space direction="vertical" size={0}>
            <Text strong style={{ color: "#334155" }}>
              {dateObj.format("DD MMM YYYY")}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <ClockCircleOutlined style={{ marginRight: 4, color: "#64748b" }} />
              {dateObj.format("hh:mm A")} IST
            </Text>
          </Space>
        );
      },
    },
    {
      title: "Reason for Visit",
      dataIndex: "reasonForVisit",
      key: "reasonForVisit",
      render: (text: string) => (
        <Space align="start">
          <FileTextOutlined style={{ color: "#94a3b8", marginTop: 3 }} />
          <Text type="secondary" style={{ color: "#475569" }}>
            {text || "—"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string) => getStatusTag(status),
    },
    
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          background: "#f8fafc",
        }}
      >
        <Spin size="large" tip="Loading patient details..." />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div style={{ padding: "40px 16px", background: "#f8fafc", minHeight: "100vh" }}>
        <Result
          status="404"
          title="Patient Record Not Found"
          subTitle={error || "The patient record you are looking for does not exist."}
          extra={
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/patient")}
              style={{ borderRadius: 8 }}
            >
              Back to Patient Directory
            </Button>
          }
        />
      </div>
    );
  }

  const age = calculateAge(patient.dateOfBirth);

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 8,
          colorPrimary: "#2563eb",
          colorBgContainer: "#ffffff",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        },
        components: {
          Card: {
            boxShadowSecondary:
              "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
          },
          Table: {
            headerBg: "#f8fafc",
            headerColor: "#475569",
            rowHoverBg: "#f1f5f9",
          },
        },
      }}
    >
      <div
        style={{
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
          padding: "24px 16px",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          {/* Navigation Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/patient")}
              style={{
                borderRadius: 8,
                fontWeight: 500,
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
            >
              Back to Directory
            </Button>

        
          </div>

          {/* Header Hero Banner Card */}
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              marginBottom: 20,
              background: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
              border: "1px solid #e2e8f0",
            }}
            styles={{ body: { padding: "28px 32px" } }}
          >
            <Row gutter={[24, 20]} align="middle">
              <Col xs={24} sm={5} md={3} style={{ textAlign: "center" }}>
                <Avatar
                  size={84}
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: "#2563eb",
                    boxShadow: "0 8px 16px -4px rgba(37, 99, 235, 0.3)",
                  }}
                />
              </Col>

              <Col xs={24} sm={19} md={21}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 16,
                  }}
                >
                  <div>
                    <Space align="center" size="middle" wrap>
                      <Title level={2} style={{ margin: 0, color: "#0f172a", fontWeight: 700 }}>
                        {patient.firstName} {patient.lastName}
                      </Title>
                      <Tag
                        color={patient.isActive ? "success" : "error"}
                        icon={
                          patient.isActive ? (
                            <CheckCircleOutlined />
                          ) : (
                            <CloseCircleOutlined />
                          )
                        }
                        style={{
                          borderRadius: 20,
                          padding: "2px 12px",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {patient.isActive ? "Active Patient" : "Inactive"}
                      </Tag>
                    </Space>

                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        gap: 20,
                        flexWrap: "wrap",
                      }}
                    >
                      <Text style={{ color: "#475569", fontSize: 14 }}>
                        <IdcardOutlined style={{ marginRight: 6, color: "#2563eb" }} />
                        MRN:{" "}
                        <Text
                          code
                          style={{
                            color: "#1d4ed8",
                            fontWeight: 700,
                            backgroundColor: "#eff6ff",
                            borderColor: "#bfdbfe",
                          }}
                        >
                          {patient.medicalRecordNumber || "—"}
                        </Text>
                      </Text>

                      <Text style={{ color: "#475569", fontSize: 14 }}>
                        <CalendarOutlined style={{ marginRight: 6, color: "#2563eb" }} />
                        {age ? `${age} Years` : "—"}
                        {patient.gender ? ` • ${patient.gender}` : ""}
                      </Text>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.7)",
                      padding: "10px 16px",
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <Text
                      type="secondary"
                      style={{ fontSize: 11, display: "block", textTransform: "uppercase", letterSpacing: 0.5 }}
                    >
                      Created Date (IST)
                    </Text>
                    <Text strong style={{ color: "#334155", fontSize: 13 }}>
                      {patient.createdAt
                        ? dayjs(patient.createdAt)
                            .tz(TIMEZONE)
                            .format("DD MMM YYYY, hh:mm A")
                        : "—"}
                    </Text>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Main Information Container */}
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e2e8f0",
            }}
            styles={{ body: { padding: "24px" } }}
          >
            <Tabs
              defaultActiveKey="overview"
              size="large"
              items={[
                {
                  key: "overview",
                  label: "Personal & Demographic Details",
                  children: (
                    <div style={{ paddingTop: 12 }}>
                      <Descriptions
                        title={
                          <Text strong style={{ fontSize: 16, color: "#1e293b" }}>
                            Patient Overview
                          </Text>
                        }
                        bordered
                        column={{ xs: 1, sm: 2, md: 3 }}
                        labelStyle={{
                          backgroundColor: "#f8fafc",
                          color: "#475569",
                          fontWeight: 600,
                          width: "18%",
                        }}
                        contentStyle={{ color: "#1e293b" }}
                      >
                        <Descriptions.Item label="First Name">
                          {patient.firstName || "—"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Last Name">
                          {patient.lastName || "—"}
                        </Descriptions.Item>
                        <Descriptions.Item label="MRN">
                          <Text code style={{ color: "#2563eb", fontWeight: 600 }}>
                            {patient.medicalRecordNumber || "—"}
                          </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Gender">
                          {patient.gender || "—"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Age">
                          {age ? `${age} years` : "—"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date of Birth">
                          {patient.dateOfBirth
                            ? dayjs(patient.dateOfBirth).format("DD MMMM YYYY")
                            : "—"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Account Status" span={3}>
                          <Tag color={patient.isActive ? "green" : "red"}>
                            {patient.isActive ? "Active Record" : "Inactive Record"}
                          </Tag>
                        </Descriptions.Item>
                      </Descriptions>

                      <Divider style={{ margin: "28px 0" }} />

                      <Descriptions
                        title={
                          <Text strong style={{ fontSize: 16, color: "#1e293b" }}>
                            Contact Details
                          </Text>
                        }
                        bordered
                        column={{ xs: 1, sm: 2 }}
                        labelStyle={{
                          backgroundColor: "#f8fafc",
                          color: "#475569",
                          fontWeight: 600,
                          width: "20%",
                        }}
                        contentStyle={{ color: "#1e293b" }}
                      >
                        <Descriptions.Item label="Phone Number">
                          <Space>
                            <PhoneOutlined style={{ color: "#2563eb" }} />
                            <Text>{patient.phoneNumber || "—"}</Text>
                          </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Email Address">
                          <Space>
                            <MailOutlined style={{ color: "#2563eb" }} />
                            <Text>{patient.email || "—"}</Text>
                          </Space>
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                  ),
                },
                {
                  key: "appointments",
                  label: (
                    <Space align="center">
                      <span>Appointment History</span>
                      <Badge
                        count={filteredAppointments.length}
                        overflowCount={99}
                        style={{ backgroundColor: "#2563eb" }}
                      />
                    </Space>
                  ),
                  children: (
                    <div style={{ paddingTop: 16 }}>
                      {/* Search & Action Controls */}
                      <Row gutter={[16, 16]} style={{ marginBottom: 20 }} align="middle">
                        <Col xs={24} sm={10} md={8}>
                          <Input
                            placeholder="Search doctor, reason, status..."
                            prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                            style={{ borderRadius: 8 }}
                          />
                        </Col>

                        <Col xs={24} sm={8} md={6}>
                          <Select
                            style={{ width: "100%" }}
                            value={statusFilter}
                            onChange={(value) => setStatusFilter(value)}
                            suffixIcon={<FilterOutlined />}
                            options={[
                              { label: "All Statuses", value: "ALL" },
                              { label: "Scheduled", value: "SCHEDULED" },
                              { label: "Checked-In", value: "CHECKED-IN" },
                              { label: "Completed", value: "COMPLETED" },
                              { label: "Cancelled", value: "CANCELLED" },
                            ]}
                          />
                        </Col>

                        <Col xs={24} sm={6} md={10} style={{ textAlign: "right" }}>
                          <Space wrap>
                            <Button
                              icon={<ReloadOutlined />}
                              loading={appointmentsLoading}
                              onClick={fetchAppointmentHistory}
                              style={{ borderRadius: 8 }}
                            >
                              Refresh
                            </Button>

                            <Tooltip
                              title={
                                hasActiveAppointment
                                  ? "Patient already has an active scheduled appointment."
                                  : ""
                              }
                            >
                              <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                disabled={hasActiveAppointment}
                                onClick={() => handleOpenAppointmentModal(patient)}
                                style={{ borderRadius: 8 }}
                              >
                                Book Appointment
                              </Button>
                            </Tooltip>
                          </Space>
                        </Col>
                      </Row>

                      {/* Appointments Data Table */}
                      <Table<AppointmentData>
                        columns={appointmentColumns}
                        dataSource={filteredAppointments}
                        loading={appointmentsLoading}
                        rowKey={(record) => record.appointmentId.toString()}
                        pagination={{ pageSize: 5, showSizeChanger: true }}
                        style={{ border: "1px solid #f1f5f9", borderRadius: 8 }}
                        locale={{
                          emptyText: searchText
                            ? "No appointments match your search filter."
                            : "No appointment history found for this patient.",
                        }}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </Card>

          {/* Book Appointment Modal */}
          <Modal
            title={
              <Space align="center" style={{ paddingBottom: 8, borderBottom: "1px solid #f1f5f9", width: "100%" }}>
                <Avatar style={{ backgroundColor: "#eff6ff", color: "#2563eb" }} icon={<CalendarOutlined />} />
                <Text strong style={{ fontSize: 16 }}>
                  Book Appointment — {selectedPatient?.firstName} {selectedPatient?.lastName}
                </Text>
              </Space>
            }
            open={isModalOpen}
            onCancel={handleCloseModal}
            footer={null}
            destroyOnClose
            centered
            width={520}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleBookAppointment}
              style={{ marginTop: 20 }}
            >
              <Form.Item
                name="doctorId"
                label={<Text strong>Select Doctor</Text>}
                rules={[{ required: true, message: "Please select a doctor." }]}
              >
                <Select
                  placeholder="Choose a medical specialist"
                  loading={doctorsLoading}
                  showSearch
                  suffixIcon={<UserSwitchOutlined />}
                  optionFilterProp="label"
                  options={doctors.map((doc) => ({
                    value: doc.docId,
                    label: doc.docname,
                  }))}
                />
              </Form.Item>

           <Form.Item
  name="appointmentDateTime"
  label={<Text strong>Appointment Date & Time</Text>}
  rules={[{ required: true, message: "Please select date and time." }]}
>
  <DatePicker
    showTime={{ format: "hh:mm A", use12Hours: true }}
    format="YYYY-MM-DD hh:mm A"
    style={{ width: "100%" }}
    placement="topLeft"
    getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
    disabledDate={(current) =>
      current && current < dayjs().startOf("day")
    }
  />
</Form.Item>

              <Form.Item
                name="reasonForVisit"
                label={<Text strong>Reason for Visit</Text>}
                rules={[{ max: 255, message: "Reason cannot exceed 255 characters." }]}
              >
                <TextArea
                  rows={3}
                  placeholder="Describe primary symptoms or visit purpose..."
                  maxLength={255}
                  showCount
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>

              <Divider style={{ margin: "20px 0 16px 0" }} />

              <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                <Space>
                  <Button onClick={handleCloseModal} style={{ borderRadius: 8 }}>
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    style={{ borderRadius: 8 }}
                  >
                    Confirm Appointment
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default PatientDetails;