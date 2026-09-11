import { apiClient } from "../api-client";
import{CountryMastersDto, CountryDto,ApiResponse } from "../models/country.dto";

const token = localStorage.getItem("token");

export const getCountries = async () => {
 
  const response = await apiClient.get("/CountryMaster/GetAllRecord",{
      headers: {
        Authorization: `Bearer ${token}`
      }});
  return response.data;
};

export const createCountry = async (data: CountryDto): Promise<ApiResponse<CountryDto>> => {
  try {
    const response = await apiClient.post<ApiResponse<CountryDto>>(
      "/CountryMaster/NewCountry", 
      data,{
      headers: {
        Authorization: `Bearer ${token}`
      }});
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create country');
  }
};

// services/country.service.ts
export const deleteCountry = async (id: number): Promise<ApiResponse<null>> => {
  try {
  const res=  await apiClient.delete(`/CountryMaster/DeleteCountryId/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }});
    
    // Manually create success response for 204
    return { success: true, message: res.data };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Delete failed');
  }
};


export const updateCountry = async (data: CountryMastersDto) => {
  const response = await apiClient.put(`/CountryMaster/Update`, data,{
      headers: {
        Authorization: `Bearer ${token}`
      }});
  return response.data;
};