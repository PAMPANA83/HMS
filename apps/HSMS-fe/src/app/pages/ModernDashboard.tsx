import { useState, useEffect } from "react";
import { Card, Row, Col, Button, Badge, ProgressBar, Table, Spinner } from "react-bootstrap";
import { FaCalendarAlt, FaCheckCircle, FaClock, FaUserMd, FaSyncAlt, FaBriefcaseMedical } from "react-icons/fa";
import { AppointmentData } from "../models/Appointment.dto";
import { getAllAppointments } from "../services/Appointment.service";

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
      alert("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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

  const completionRate =
    statusCounts.total > 0
      ? Math.round((statusCounts.completed / statusCounts.total) * 100)
      : 0;

  const metrics = [
    {
      label: "Total Appointments",
      value: statusCounts.total,
      icon: <FaCalendarAlt className="text-primary me-2" />,
      variant: "primary",
    },
    {
      label: "Scheduled",
      value: statusCounts.scheduled,
      icon: <FaClock className="text-primary me-2" />,
      variant: "primary",
    },
    {
      label: "Pending",
      value: statusCounts.pending,
      icon: <FaClock className="text-warning me-2" />,
      variant: "warning",
    },
    {
      label: "Completed",
      value: statusCounts.completed,
      icon: <FaCheckCircle className="text-success me-2" />,
      variant: "success",
    },
  ];

  return (
    <div className="p-4 bg-light min-vh-100">
      <Row className="align-items-center justify-content-between mb-4">
        <Col xs="auto">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-primary text-white"
              style={{ width: 44, height: 44 }}
            >
              <FaBriefcaseMedical size={22} />
            </div>
            <div>
              <h3 className="mb-0">Appointment Analytics</h3>
              <small className="text-muted">Real-time status overview & doctor performance</small>
            </div>
          </div>
        </Col>
        <Col xs="auto">
          <Button variant="outline-primary" className="rounded-3 d-flex align-items-center gap-2" onClick={fetchAppointments} disabled={loading}>
            <FaSyncAlt />
            Refresh
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Row className="g-3 mb-4">
            {metrics.map((metric) => (
              <Col xs={12} sm={6} lg={3} key={metric.label}>
                <Card className="shadow-sm border-0 rounded-3 h-100">
                  <Card.Body>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <small className="text-muted mb-0">{metric.label}</small>
                      {metric.icon}
                    </div>
                    <div className={`fs-3 fw-bold text-${metric.variant}`}>{metric.value}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Row className="g-3">
            <Col xs={12} lg={8}>
              <Card className="shadow-sm border-0 rounded-3 h-100">
                <Card.Header className="bg-white border-0 fw-semibold fs-6">
                  Doctor Workload & Status Breakdown
                </Card.Header>
                <Card.Body className="p-0">
                  <Table striped bordered hover responsive className="mb-0">
                    <thead>
                      <tr>
                        <th>Doctor</th>
                        <th>Total Load</th>
                        <th>Scheduled</th>
                        <th>Pending</th>
                        <th>Completed</th>
                        <th>Cancelled</th>
                        <th>Completion Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctorSummaryData.map((doctor) => {
                        const rate = doctor.total > 0 ? Math.round((doctor.completed / doctor.total) * 100) : 0;
                        return (
                          <tr key={doctor.doctorName}>
                            <td>
                              <div className="d-flex align-items-center gap-2 text-nowrap">
                                <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary" style={{ width: 36, height: 36 }}>
                                  <FaUserMd size={14} />
                                </div>
                                <span className="fw-semibold">{doctor.doctorName}</span>
                              </div>
                            </td>
                            <td><Badge bg="dark" pill>{doctor.total}</Badge></td>
                            <td><Badge bg="primary" pill>{doctor.scheduled}</Badge></td>
                            <td><Badge bg="warning" text="dark" pill>{doctor.pending}</Badge></td>
                            <td><Badge bg="success" pill>{doctor.completed}</Badge></td>
                            <td><Badge bg="danger" pill>{doctor.cancelled}</Badge></td>
                            <td style={{ minWidth: 130 }}>
                              <ProgressBar now={rate} label={`${rate}%`} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} lg={4}>
              <Card className="shadow-sm border-0 rounded-3 h-100">
                <Card.Header className="bg-white border-0 fw-semibold fs-6">
                  Efficiency Overview
                </Card.Header>
                <Card.Body className="text-center">
                  <div className="d-flex justify-content-center my-3">
                    <div className="position-relative d-inline-flex align-items-center justify-content-center rounded-circle border border-success border-5" style={{ width: 160, height: 160 }}>
                      <span className="fw-bold fs-3 text-success">{completionRate}%</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="fw-semibold fs-5">Overall Completion Rate</div>
                    <small className="text-muted">
                      {statusCounts.completed} out of {statusCounts.total} appointments completed
                    </small>
                  </div>

                  <div className="border-top pt-3 text-start">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Cancellation Rate:</span>
                      <strong className="text-danger">
                        {statusCounts.total > 0 ? Math.round((statusCounts.cancelled / statusCounts.total) * 100) : 0}%
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Active Queue:</span>
                      <strong className="text-warning">
                        {statusCounts.scheduled + statusCounts.pending} Pending
                      </strong>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
