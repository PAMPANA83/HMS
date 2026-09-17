import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import {
  ArrowClockwise,
  EyeFill,
  PersonCircle,
  PlusLg,
  Search,
} from "react-bootstrap-icons";
import DataTable, { type TableColumn } from "react-data-table-component";
import { message } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import { PatientAppointment } from "../models/Patients.dto";
import { getAllPatients } from "../services/Patients.service";

const calculateAge = (dobString?: string): number => {
  if (!dobString) return 0;
  const dob = dayjs(dobString);
  if (!dob.isValid()) return 0;
  return dayjs().diff(dob, "year");
};

export function Patient() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientAppointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");

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

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const filteredPatients = useMemo(() => {
    const query = searchText.toLowerCase().trim();
    if (!query) return patients;

    return patients.filter((patient) => {
      const fullName = `${patient.firstName ?? ""} ${patient.lastName ?? ""}`.toLowerCase();
      const mrn = patient.medicalRecordNumber?.toLowerCase() ?? "";
      const phone = patient.phoneNumber ?? "";
      const email = patient.email?.toLowerCase() ?? "";

      return fullName.includes(query) || mrn.includes(query) || phone.includes(query) || email.includes(query);
    });
  }, [patients, searchText]);

  const columns: TableColumn<PatientAppointment>[] = useMemo(
    () => [
      {
        name: "MRN",
        selector: (row) => row.medicalRecordNumber || "-",
        sortable: true,
        width: "160px",
        cell: (row) => (
          <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 fw-semibold">
            {row.medicalRecordNumber || "-"}
          </span>
        ),
      },
      {
        name: "Patient Name",
        selector: (row) => `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim() || "-",
        sortable: true,
        minWidth: "260px",
        cell: (row) => (
          <div className="d-flex align-items-center gap-2 py-2">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle text-white fw-semibold"
              style={{
                width: 28,
                height: 28,
                backgroundColor: "#2563eb",
                fontSize: 12,
              }}
            >
              {row.firstName ? row.firstName.charAt(0).toUpperCase() : <PersonCircle size={14} />}
            </div>
            <div>
              <div className="fw-semibold text-dark">
                {row.firstName || ""} {row.lastName || ""}
              </div>
              {row.email && <small className="text-secondary">{row.email}</small>}
            </div>
          </div>
        ),
      },
      {
        name: "Age / Gender",
        selector: (row) => `${calculateAge(row.dateOfBirth) ? `${calculateAge(row.dateOfBirth)} yrs` : "-"} ${row.gender ? `/ ${row.gender}` : ""}`,
        sortable: true,
        width: "150px",
        hide: 768,
        cell: (row) => (
          <span className="text-secondary">
            {calculateAge(row.dateOfBirth) ? `${calculateAge(row.dateOfBirth)} yrs` : "-"}
            {row.gender ? ` / ${row.gender}` : ""}
          </span>
        ),
      },
      {
        name: "Phone Number",
        selector: (row) => row.phoneNumber || "-",
        sortable: true,
        width: "160px",
        cell: (row) => <span className="text-secondary">{row.phoneNumber || "-"}</span>,
      },
      {
        name: "Created On",
        selector: (row) => (row.createdAt && dayjs(row.createdAt).isValid() ? dayjs(row.createdAt).format("DD/MM/YYYY") : "-"),
        sortable: true,
        width: "140px",
        hide: 980,
        cell: (row) => (
          <span className="text-secondary">
            {row.createdAt && dayjs(row.createdAt).isValid() ? dayjs(row.createdAt).format("DD/MM/YYYY") : "-"}
          </span>
        ),
      },
      {
        name: "Status",
        selector: (row) => (row.isActive ? "Active" : "Inactive"),
        sortable: true,
        width: "120px",
        center: true,
        cell: (row) => (
          <span
            className={`badge rounded-pill ${row.isActive ? "bg-success-subtle text-success border border-success-subtle" : "bg-danger-subtle text-danger border border-danger-subtle"}`}
            style={{ fontWeight: 500 }}
          >
            {row.isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        name: "Action",
        button: true,
        width: "120px",
        center: true,
        cell: (row) => {
          const id = row.patientId ?? (row as any).id ?? (row as any)._id;

          return (
            <Button
              variant="outline-primary"
              size="sm"
              className="d-flex align-items-center justify-content-center gap-1"
              onClick={() => {
                if (!id) {
                  message.warning("Patient ID is missing.");
                  return;
                }
                navigate(`/patient/${id}`);
              }}
            >
              <EyeFill size={14} /> View
            </Button>
          );
        },
      },
    ],
    [navigate]
  );

  return (
    <div className="bg-light min-vh-100 p-3 p-md-4">
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <Card className="border-0 shadow-sm rounded-4">
          <Card.Body className="p-2 p-md-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
              <div>
                <h3 className="mb-1 fw-bold text-dark">Patient Directory</h3>
                <p className="text-muted mb-0">Search and manage registered patient medical records</p>
              </div>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                <div className="position-relative">
                  <Search className="position-absolute top-50 translate-middle-y ms-3 text-secondary" style={{ left: 18 }} />
                  <Form.Control
                    className="ps-5"
                    style={{ minWidth: 260 }}
                    placeholder="Search MRN, Name, Phone, Email..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                <Button variant="outline-secondary" className="d-flex align-items-center gap-2" onClick={fetchPatients} disabled={loading}>
                  <ArrowClockwise /> Refresh
                </Button>
                <Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => navigate("/patient/add")}>
                  <PlusLg /> Add Patient
                </Button>
              </div>
            </div>

            <DataTable
              className="patient-data-table"
              columns={columns}
              data={filteredPatients}
              keyField="patientId"
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
              progressPending={loading}
              persistTableHead
              highlightOnHover
              responsive
              striped
              noDataComponent={<div className="py-4 text-muted">No patients found</div>}
              customStyles={{
                headCells: { style: { fontWeight: 600, color: "#334155", backgroundColor: "#f8fafc" } },
                rows: { style: { minHeight: "58px" } },
                cells: { style: { paddingLeft: "10px", paddingRight: "10px" } },
              }}
            />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Patient;