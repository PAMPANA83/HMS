// src/models/branch.dto.ts
export interface BranchMastersDto {
 id: number;
  companyId: number;
  companyName: string;
  branchName: string;
  branchCode: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  cityId: number;
  cityName: string;
  stateId: number;
  stateName: string;
  countryId: number;
  countryName: string;
  postalCode: string;
  isMainBranch: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBranchDto {
  companyId: number;
  branchName: string;
  branchCode: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  cityId: number;
  stateId: number;
  countryId: number;
  postalCode: string;
  isMainBranch: boolean;
  isActive: boolean;
}


export interface UpdateBranchDto {
  id?: number;  
  branchID?: string;  
  branchName: string;
  branchHeader?: string;
  registerName?: string;
  labHeader?: string;
  companyID: number;
  address: string;
  stateID: number;
  districtID: number;
  cityID: number;
  areaID: number;
  mobile1?: string;
  mobile2?: string;
  phone?: string;
  contactPerson?: string;
  
}