import { apiClient } from "../api-client";
import {ApiResponse} from "../models/country.dto";
import{CreateDoctorDto,UpdateDoctorDto} from "../models/Doctor.dto";
const token = localStorage.getItem("token");

export const getDoctors = async () => {
  const response = await apiClient.get("/Doctor/AllDoctor",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }});
  return response.data;
};

export const deleteDoctor = async (id: number): Promise<ApiResponse<null>> => {
  try {
  const res=  await apiClient.delete(`/Doctor/DeleteDoctorByID/${id}`,
      {
      headers: {
        Authorization: `Bearer ${token}`
      }});
    
   
    return { success: true, message: res.data };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Delete failed');
  }
};


export const createDoctor = async (data: CreateDoctorDto): Promise<ApiResponse<CreateDoctorDto>> => {
  try {
    const response = await apiClient.post<ApiResponse<CreateDoctorDto>>(
      "/Doctor/RegisterDoctor", 
      data,{
      headers: {
        Authorization: `Bearer ${token}`
      }});
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message);
  }
};

export const updateDoctor = async (data: UpdateDoctorDto) => {
  const response = await apiClient.put(`/Doctor/updateDoctor`, data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }});
  return response.data;
};


export const getDoctorsdropdown = async () => {
  const response = await apiClient.get("/Doctor/Doctordropdown",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }});
  return response.data;
};

export const getDoctorsResdropdown = async () => {
  const response = await apiClient.get("/Doctor/DoctorRegdropdown",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }});
  return response.data;
};



export const GetDoctobyID = async (id: number): Promise<ApiResponse<null>> => {
  try {
  const res=  await apiClient.get(`/Doctor/DoctorByID/${id}`,
      {
      headers: {
        Authorization: `Bearer ${token}`
      }});
    
   
    return { success: true, message: res.data };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Delete failed');
  }
};
