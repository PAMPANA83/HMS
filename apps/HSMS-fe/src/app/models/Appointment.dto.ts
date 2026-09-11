export interface AppointmentData {
  appointmentId: number;
  patientId: number;
  medicalRecordNumber: string;
  firstName: string;
  lastName: string;
  doctorId: number;
  doctorName: string;
  appointmentDateTime: string;
  status: string;
  reasonForVisit: string;
  createdAt?: string;
}

export interface CreateAppointmentDto {
  patientId: number;
  doctorId: number;
  appointmentDateTime: string; // ISO 8601 string
  reasonForVisit: string;
}

export interface patientDropdown {
  id: number;
  patientname: string;

}

export interface DoctorOption {
  docId: number;
  docname: string;

}

export interface UpdateStatusDto {
  appointmentId: number;
  status: string;
}