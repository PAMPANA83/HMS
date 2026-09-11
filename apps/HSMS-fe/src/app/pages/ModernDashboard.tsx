import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Typography,
  Tag,
  Spin,
  message,
  Space,
  Button,
  Progress,
  Avatar,
  Badge,
} from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ReloadOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table/interface";
import { AppointmentData } from "../models/Appointment.dto";
import { getAllAppointments } from "../services/Appointment.service";

const { Title, Text } = Typography;

interface DoctorStatusSummary {
  doctorName: string;
  total: number;
  scheduled: number;
  pending: number;
  completed: number;
  cancelled: number;
}

export function ModernDashboard() {
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
      console.error("Error fetching dashboard data:", error);
      message.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Calculate Overall Status Counts
  const statusCounts = appointments.reduce(
    (acc, app) => {
      const status = app.status || "Scheduled";
      acc.total += 1;
      if (status === "Scheduled") acc.scheduled += 1;
      else if (status === "Checked-In") acc.pending += 1;
      else if (status === "Completed") acc.completed += 1;
      else if (status === "Cancelled") acc.cancelled += 1;
      return acc;
    },
    { total: 0, scheduled: 0, pending: 0, completed: 0, cancelled: 0 }
  );

  // Calculate Doctor-wise Summary
  const doctorSummaryMap = appointments.reduce((acc, app) => {
    const docName = app.doctorName || "Unassigned";
    const status = app.status || "Scheduled";

    if (!acc[docName]) {
      acc[docName] = {
        doctorName: docName,
        total: 0,
        scheduled: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
      };
    }

    acc[docName].total += 1;
    if (status === "Scheduled") acc[docName].scheduled += 1;
    else if (status === "Checked-In") acc[docName].pending += 1;
    else if (status === "Completed") acc[docName].completed += 1;
    else if (status === "Cancelled") acc[docName].cancelled += 1;

    return acc;
  }, {} as Record<string, DoctorStatusSummary>);

  const doctorSummaryData: DoctorStatusSummary[] = Object.values(doctorSummaryMap);

  // Completion rate calculation
  const completionRate =
    statusCounts.total > 0
      ? Math.round((statusCounts.completed / statusCounts.total) * 100)
      : 0;

  // Fixed Table Columns Definitions with explicit widths and whiteSpace rules
  const doctorColumns: ColumnsType<DoctorStatusSummary> = [
    {
      title: "Doctor",
      dataIndex: "doctorName",
      key: "doctorName",
      width: 220,
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
          <Avatar
            style={{ backgroundColor: "#e6f4ff", color: "#1677ff", flexShrink: 0 }}
            icon={<UserOutlined />}
          />
          <Text strong style={{ whiteSpace: "nowrap" }}>
            {text}
          </Text>
        </div>
      ),
    },
    {
      title: "Total Load",
      dataIndex: "total",
      key: "total",
      width: 110,
      sorter: (a, b) => a.total - b.total,
      render: (val) => (
        <Badge count={val} overflowCount={999} style={{ backgroundColor: "#001529" }} />
      ),
    },
    {
      title: "Scheduled",
      dataIndex: "scheduled",
      key: "scheduled",
      width: 100,
      render: (val) => (
        <Tag color="blue" style={{ borderRadius: 12, padding: "0 10px" }}>
          {val}
        </Tag>
      ),
    },
    {
      title: "Pending",
      dataIndex: "pending",
      key: "pending",
      width: 100,
      render: (val) => (
        <Tag color="gold" style={{ borderRadius: 12, padding: "0 10px" }}>
          {val}
        </Tag>
      ),
    },
    {
      title: "Completed",
      dataIndex: "completed",
      key: "completed",
      width: 100,
      render: (val) => (
        <Tag color="green" style={{ borderRadius: 12, padding: "0 10px" }}>
          {val}
        </Tag>
      ),
    },
    {
      title: "Cancelled",
      dataIndex: "cancelled",
      key: "cancelled",
      width: 100,
      render: (val) => (
        <Tag color="red" style={{ borderRadius: 12, padding: "0 10px" }}>
          {val}
        </Tag>
      ),
    },
    {
      title: "Completion Rate",
      key: "rate",
      width: 160,
      render: (_, record) => {
        const rate =
          record.total > 0 ? Math.round((record.completed / record.total) * 100) : 0;
        return <Progress percent={rate} size="small" strokeColor="#52c41a" style={{ width: 100 }} />;
      },
    },
  ];

  return (
    <div style={{ padding: "24px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
        <Col>
          <Space align="center" size="middle">
            <Avatar
              size={44}
              shape="square"
              style={{ backgroundColor: "#1677ff", borderRadius: 10 }}
              icon={<MedicineBoxOutlined />}
            />
            <div>
              <Title level={3} style={{ margin: 0 }}>
                Appointment Analytics
              </Title>
              <Text type="secondary">Real-time status overview & doctor performance</Text>
            </div>
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            ghost
            icon={<ReloadOutlined />}
            onClick={fetchAppointments}
            loading={loading}
            style={{ borderRadius: 8 }}
          >
            Refresh
          </Button>
        </Col>
      </Row>

      <Spin spinning={loading}>
        {/* Metric Cards Row */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <Statistic
                title={<Text type="secondary">Total Appointments</Text>}
                value={statusCounts.total}
                prefix={<CalendarOutlined style={{ color: "#1677ff", marginRight: 8 }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <Statistic
                title={<Text type="secondary">Scheduled</Text>}
                value={statusCounts.scheduled}
                valueStyle={{ color: "#1677ff" }}
                prefix={<ClockCircleOutlined style={{ marginRight: 8 }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <Statistic
                title={<Text type="secondary">Pending</Text>}
                value={statusCounts.pending}
                valueStyle={{ color: "#faad14" }}
                prefix={<ClockCircleOutlined style={{ marginRight: 8 }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <Statistic
                title={<Text type="secondary">Completed</Text>}
                value={statusCounts.completed}
                valueStyle={{ color: "#52c41a" }}
                prefix={<CheckCircleOutlined style={{ marginRight: 8 }} />}
              />
            </Card>
          </Col>
        </Row>

        {/* Doctor Table and Efficiency Progress */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={17}>
            <Card
              title={<Text strong style={{ fontSize: 16 }}>Doctor Workload & Status Breakdown</Text>}
              style={{ borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
            >
              <Table
                columns={doctorColumns}
                dataSource={doctorSummaryData}
                rowKey="doctorName"
                pagination={{ pageSize: 5 }}
                scroll={{ x: 800 }}
              />
            </Card>
          </Col>

          {/* Efficiency Overview Card */}
          <Col xs={24} lg={7}>
            <Card
              title={<Text strong style={{ fontSize: 16 }}>Efficiency Overview</Text>}
              style={{ borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", height: "100%" }}
            >
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <Progress
                  type="dashboard"
                  percent={completionRate}
                  strokeColor="#52c41a"
                  size={160}
                />
                <div style={{ marginTop: 12 }}>
                  <Text strong style={{ fontSize: 16, display: "block" }}>
                    Overall Completion Rate
                  </Text>
                  <Text type="secondary">
                    {statusCounts.completed} out of {statusCounts.total} appointments completed
                  </Text>
                </div>
              </div>

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Text type="secondary">Cancellation Rate:</Text>
                  <Text type="danger" strong>
                    {statusCounts.total > 0
                      ? Math.round((statusCounts.cancelled / statusCounts.total) * 100)
                      : 0}
                    %
                  </Text>
                </Row>
                <Row justify="space-between">
                  <Text type="secondary">Active Queue:</Text>
                  <Text type="warning" strong>
                    {statusCounts.scheduled + statusCounts.pending} Pending
                  </Text>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}