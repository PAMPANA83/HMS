export interface CreateDoctorDto {
  branchId: number;
  userId: number;
  departmentId?: number;
  specialization?: string;
  licenseNumber?: string;
  consultationFee?: number;
  isActive: boolean;
  createBy?: number;
}

export interface UpdateDoctorDto {
  id: number;
  branchId: number;
  departmentId?: number;
  specialization?: string;
  licenseNumber?: string;
  consultationFee?: number;
  isActive: boolean;
  updateBy?: number;
}


export interface DoctorDto {
  id: number;
  branchId: number;
  branchName?: string;
  userId: number;
  doctorName?: string;
  departmentId?: number;
  departmentName?: string;
  specialization?: string;
  licenseNumber?: string;
  consultationFee?: number;
  isActive: boolean;
  createdAt?: string;
  createdBy?: number;
  createdUser?: string;
  updatedAt?: string;
  updatedBy?: number;
  updateUser?: string;
}