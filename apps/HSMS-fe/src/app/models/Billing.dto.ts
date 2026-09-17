export interface CreateBillingDto {
  patientId: number;
  appointmentId: number;
  createdBy: number;
}

export interface BillingMastersDto {
  id: number;
  billNumber: string;
  patientId: number;
  patientName: string;
  appointmentId: number;
  appointmentDate: string;
  doctorName: string;
  totalAmount: number;
  paidAmount: number;
  paymentStatus:string;
  paymentMethod:string;
  createdBy: string;
  createdAt: number;  
}

export interface UpdateBillingDto {
  billNumber?: string;
  paidAmount?: number;
  paymentStatus?: string;
  paymentMethod: string;
}