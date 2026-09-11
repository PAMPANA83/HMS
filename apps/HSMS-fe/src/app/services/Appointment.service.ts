import { apiClient } from "../api-client";
import{CreateAppointmentDto,UpdateStatusDto} from "../models/Appointment.dto";
import {ApiResponse} from "../models/country.dto";
const token = localStorage.getItem("token");

export const getAllAppointments = async () => {
  const response = await apiClient.get("/Appointment/GetAllAppointment",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }});
  return response;
};

export const createNewAppointment = async (data: CreateAppointmentDto): Promise<ApiResponse<CreateAppointmentDto>> => {
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

export const getAllpatientdropdown = async () => {
  const response = await apiClient.get("/Patients/patientDropdown",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }});
  return response.data;
};


export const UpdatestatusAppointment = async (data: UpdateStatusDto): Promise<ApiResponse<UpdateStatusDto>> => {
  try {
    const response = await apiClient.put<ApiResponse<UpdateStatusDto>>(
      "/Appointment/UpdateAppointment", 
      data,{
      headers: {
        Authorization: `Bearer ${token}`
      }});
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message);
  }
};