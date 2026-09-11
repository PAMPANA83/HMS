export interface PatientAppointment {
  patientId: number;
  medicalRecordNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO Date string from backend
  gender: string;
  phoneNumber: string;
  email?: string | null;
  isActive: boolean;
  createdAt: string;
}


export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO String format
  gender: 'Male' | 'Female' | 'Other';
  phoneNumber: string;
  email?: string;
  doctorId: number;
  appointmentDateTime: string; // ISO String format
  reasonForVisit?: string;
  isActive: boolean;
}

export interface DoctorOption {
  docId: number;
  docname: string;

}

export  interface AppointmentData {
  appointmentId: number;
  doctorName: string;
  appointmentDateTime: string;
  status: string;
  reasonForVisit: string;
}

export interface CreateAppointmentDto
{
patientId: number;
doctorId: number;
appointmentDateTime: string;
reasonForVisit: string;
}