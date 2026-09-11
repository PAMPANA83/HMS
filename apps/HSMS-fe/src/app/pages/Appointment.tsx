import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Card,
  Input,
  Space,
  message,
  Typography,
  Select,
  Row,
  Col,
  Tooltip,
  Modal,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  FilterOutlined,
  MedicineBoxOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table/interface";
import { useNavigate } from "react-router-dom";
import { AppointmentData } from "../models/Appointment.dto";
import { getAllAppointments, UpdatestatusAppointment } from "../services/Appointment.service";

const { Title } = Typography;
const { Option } = Select;

export interface UpdateStatusDto {
  appointmentId: number;
  status: string;
}

export function Appointment() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // State for Status Update Modal Popup
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAllAppointments();
      const responseData = data?.data;
      const appointmentsData = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.Data)
          ? responseData.Data
          : [];
      setAppointments(appointmentsData as AppointmentData[]);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      message.error("Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Open Modal Popup for updating status
  const openStatusModal = (record: AppointmentData) => {
    setSelectedAppointment(record);
    setNewStatus(record.status || "Scheduled");
    setIsModalOpen(true);
  };

  // Submit Status Change API Request
  const handleUpdateStatus = async () => {
    if (!selectedAppointment?.appointmentId) return;

    const payload: UpdateStatusDto = {
      appointmentId: selectedAppointment.appointmentId,
      status: newStatus,
    };
    
    setUpdating(true);
    try {
      await UpdatestatusAppointment(payload);
      message.success(`Status updated to "${newStatus}" successfully.`);
      setIsModalOpen(false);
      fetchAppointments();
    } catch (error) {
      console.error("Failed to update status:", error);
      message.error("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const searchLower = searchText.trim().toLowerCase();
    const matchesSearch =
      !searchLower ||
      appointment.reasonForVisit?.toLowerCase().includes(searchLower) ||
      appointment.firstName?.toLowerCase().includes(searchLower) ||
      appointment.lastName?.toLowerCase().includes(searchLower) ||
      appointment.doctorName?.toLowerCase().includes(searchLower) ||
      appointment.appointmentId?.toString().includes(searchLower);

    const matchesStatus =
      statusFilter === "ALL" || appointment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns: ColumnsType<AppointmentData> = [
    {
      title: "App ID",
      dataIndex: "appointmentId",
      key: "appointmentId",
      render: (text) => <strong>{text ?? "N/A"}</strong>,
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Doctor",
      dataIndex: "doctorName",
      key: "doctorName",
    },
    {
      title: "Date & Time",
      dataIndex: "appointmentDateTime",
      key: "appointmentDateTime",
      render: (dateTime: string) =>
        dateTime ? new Date(dateTime).toLocaleString() : "N/A",
      sorter: (a, b) => {
        const timeA = a.appointmentDateTime ? new Date(a.appointmentDateTime).getTime() : 0;
        const timeB = b.appointmentDateTime ? new Date(b.appointmentDateTime).getTime() : 0;
        return timeA - timeB;
      },
    },
    {
      title: "Reason for Visit",
      dataIndex: "reasonForVisit",
      key: "reasonForVisit",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        if (status === "Completed") color = "green";
        if (status === "Cancelled") color = "red";
        if (status === "Pending") color = "gold";
        return <Tag color={color}>{status || "Scheduled"}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const isCompletedOrCancelled =
          record.status === "Completed" || record.status === "Cancelled";

        return (
          <Space size="middle">
            <Tooltip
              title={
                isCompletedOrCancelled
                  ? `Cannot update status for ${record.status.toLowerCase()} appointments`
                  : "Update Status"
              }
            >
              <Button
                type="text"
                icon={<SyncOutlined />}
                disabled={isCompletedOrCancelled}
                onClick={() => openStatusModal(record)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              <MedicineBoxOutlined style={{ marginRight: "8px" }} />
              Appointment Management
            </Title>
          </Col>
          <Col>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={fetchAppointments} loading={loading}>
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/patient")}
              >
                New Appointment
              </Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: "16px" }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search by Name, Doctor, ID, or Reason"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              defaultValue="ALL"
              style={{ width: "100%" }}
              onChange={(val) => setStatusFilter(val)}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="ALL">All Statuses</Option>
              <Option value="Scheduled">Scheduled</Option>
              <Option value="Checked-In">Checked-In</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredAppointments}
          rowKey={(record) => record.appointmentId || record.appointmentDateTime || Math.random().toString()}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      {/* Status Update Modal Popup */}
      <Modal
        title={`Update Status (App ID: #${selectedAppointment?.appointmentId})`}
        open={isModalOpen}
        onOk={handleUpdateStatus}
        confirmLoading={updating}
        onCancel={() => setIsModalOpen(false)}
        okText="Update"
      >
        <div style={{ padding: "16px 0" }}>
          <Typography.Text style={{ display: "block", marginBottom: 8 }}>
            Select New Status:
          </Typography.Text>
          <Select
            value={newStatus}
            style={{ width: "100%" }}
            onChange={(val) => setNewStatus(val)}
          >
            <Option value="Scheduled">Scheduled</Option>
            <Option value="Checked-In">Checked-In</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
}