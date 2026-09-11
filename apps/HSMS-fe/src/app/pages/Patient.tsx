import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Card,
  Typography,
  Tag,
  Space,
  Input,
  Button,
  message,
  ConfigProvider,

  Form,

} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
  EyeOutlined,
  PlusOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";

import { PatientAppointment } from "../models/Patients.dto";
import { getAllPatients } from "../services/Patients.service";


const { Title, Text } = Typography;
const { TextArea } = Input;

// Helper: Calculate age from DateOfBirth string
const calculateAge = (dobString?: string): number => {
  if (!dobString) return 0;
  const dob = dayjs(dobString);
  if (!dob.isValid()) return 0;
  return dayjs().diff(dob, "year");
};

export function Patient() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [patients, setPatients] = useState<PatientAppointment[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");  // Modal State

  const [selectedPatient, setSelectedPatient] = useState<PatientAppointment | null>(null);

  // Fetch Patients
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllPatients();
      const listData = Array.isArray(response)
        ? response
        : response?.data?.data ?? response?.data ?? response?.message ?? [];

      setPatients(Array.isArray(listData) ? listData : []);
    } catch (error) {
      console.error("Failed to load patient records:", error);
      message.error("Failed to load patient records.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Doctors Dropdown List


  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Search Filter
  const filteredPatients = patients.filter((patient) => {
    const query = searchText.toLowerCase().trim();
    if (!query) return true;

    const fullName = `${patient.firstName ?? ""} ${patient.lastName ?? ""}`.toLowerCase();
    const mrn = patient.medicalRecordNumber?.toLowerCase() ?? "";
    const phone = patient.phoneNumber ?? "";
    const email = patient.email?.toLowerCase() ?? "";

    return (
      fullName.includes(query) ||
      mrn.includes(query) ||
      phone.includes(query) ||
      email.includes(query)
    );
  });

  // Ant Design Table Columns
  const columns: ColumnsType<PatientAppointment> = [
    {
      title: "MRN",
      dataIndex: "medicalRecordNumber",
      key: "medicalRecordNumber",
      width: 160,
      render: (mrn: string) => (
        <Text code style={{ color: "#2563eb", fontWeight: 600 }}>
          {mrn || "—"}
        </Text>
      ),
    },
    {
      title: "Patient Name",
      key: "fullName",
      sorter: (a, b) =>
        `${a.firstName ?? ""}`.localeCompare(`${b.firstName ?? ""}`),
      render: (_, record) => (
        <Space>
          <UserOutlined style={{ color: "#2563eb" }} />
          <div>
            <Text
              strong
              style={{ color: "#0f172a", display: "block", lineHeight: "1.2" }}
            >
              {record.firstName} {record.lastName}
            </Text>
            {record.email && (
              <Text type="secondary" style={{ fontSize: 11 }}>
                {record.email}
              </Text>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: "Age / Gender",
      key: "ageGender",
      width: 120,
      render: (_, record) => {
        const age = calculateAge(record.dateOfBirth);
        return (
          <Text style={{ fontSize: 13 }}>
            {age ? `${age} yrs` : "—"} {record.gender ? `/ ${record.gender}` : ""}
          </Text>
        );
      },
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 140,
      render: (phone: string) => phone || "—",
    },
    {
      title: "Created On",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      sorter: (a, b) =>
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      render: (dateStr: string) =>
        dateStr && dayjs(dateStr).isValid()
          ? dayjs(dateStr).format("DD/MM/YYYY")
          : "—",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      align: "center",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"} style={{ borderRadius: 12 }}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 180,
      align: "center",
      render: (_, record: any) => {
        const id = record.patientId ?? record.id ?? record._id;

        return (
          <Space size="small">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined style={{ color: "#2563eb" }} />}
              onClick={() => {
                if (!id) {
                  message.warning("Patient ID is missing.");
                  return;
                }
                navigate(`/patient/${id}`);
              }}
            >
              View
            </Button>

            
          </Space>
        );
      },
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 6,
          colorPrimary: "#2563eb",
        },
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px" }}>
        <Card
          bordered={false}
          style={{
            borderRadius: 12,
            boxShadow:
              "0 1px 3px rgba(16, 24, 40, 0.05), 0 1px 2px rgba(16, 24, 40, 0.06)",
          }}
          styles={{ body: { padding: "20px" } }}
        >
          {/* Header Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <Title level={4} style={{ margin: 0, color: "#0f172a" }}>
                Patient Directory
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Search and manage registered patient medical records
              </Text>
            </div>

            <Space wrap>
              <Input
                placeholder="Search MRN, Name, Phone, Email..."
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                style={{ width: 280 }}
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchPatients}
                loading={loading}
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/patient/add")}
              >
                Add Patient
              </Button>
            </Space>
          </div>

          {/* Records Table */}
          <Table
            columns={columns}
            dataSource={filteredPatients}
            rowKey={(record: any) => record.patientId ?? record.id ?? record._id}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total) => `Total ${total} patients`,
            }}
            size="middle"
          />
        </Card>

        
      </div>
    </ConfigProvider>
  );
}

export default Patient;