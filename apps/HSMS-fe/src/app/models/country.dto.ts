
export interface CountryMastersDto {
   id: number;
  name: string;
  isoCode: string;
  phoneCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CountryDto {
  name: string;
  isoCode: string;
  phoneCode: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}