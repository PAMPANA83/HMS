import { apiClient } from "../api-client";

import {CreatePatientDto,CreateAppointmentDto } from "../models/Patients.dto";
import {ApiResponse} from "../models/country.dto";
const token = localStorage.getItem("token");

export const getAllPatients = async () => {
  const response = await apiClient.get("/Patients/AllPatientsrecord",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }});
  return response.data;
};


export const createPatiemts = async (data: CreatePatientDto): Promise<ApiResponse<CreatePatientDto>> => {
  try {
    const response = await apiClient.post<ApiResponse<CreatePatientDto>>(
      "/Patients/Createpatients", 
      data,{
      headers: {
        Authorization: `Bearer ${token}`
      }});
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message);
  }
};



export const GetpatientbyID = async (id: number): Promise<ApiResponse<null>> => {
  try {
  const res=  await apiClient.get(`/Patients/GetPatientbyId/${id}`,
      {
      headers: {
        Authorization: `Bearer ${token}`
      }});
    
   
    return { success: true, message: res.data };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Delete failed');
  }
};



export const GetAppointmentpatientbyID = async (id: number): Promise<ApiResponse<null>> => {
  try {
  const res=  await apiClient.get(`/Appointment/getAppointmentbyPatientID/${id}`,
      {
      headers: {
        Authorization: `Bearer ${token}`
      }});
    
   
    return { success: true, message: res.data };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Delete failed');
  }
};



export const createPatiemtsAppoint = async (data: CreateAppointmentDto): Promise<ApiResponse<CreateAppointmentDto>> => {
  try {
    const response = await apiClient.post<ApiResponse<CreateAppointmentDto>>(
      "/Appointment/CreateAppointment", 
      data,{
      headers: {
        Authorization: `Bearer ${token}`
      }});
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message);
  }
};