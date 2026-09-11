
export interface CompanyMastersDto {
   id: number;
  companyname: string;
  registrationNumber: string;
  gstin: string;
  panNumber: string;
  email: string;
  phone: string;
  website?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  cityId: number;
  stateId: number;
  countryId: number;
  cityName: string;
  stateName: string;
  countryName: string;
  postalCode?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

}

export interface CreateCompanyDto {
  isActive: boolean;
  companyname: string;
  registrationNumber: string;
  gstin: string;
  panNumber: string;
  email: string;
  phone: string;
  website: string;
  addressLine1: string;
  addressLine2?: string;
  cityId: number;
  stateId: number;
  countryId: number;
  postalCode: string;
}
