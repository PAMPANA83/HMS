import { apiClient } from "../api-client";
import { CreateStateMasters } from "../models/state.dto";
import {ApiResponse} from "../models/country.dto"

const token = localStorage.getItem("token");
export const getState = async () => {
  const response = await apiClient.get("/StateMaster/GetAllStateMasters",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }});
  return response.data;
};



export const createstate = async (data: CreateStateMasters): Promise<ApiResponse<CreateStateMasters>> => {
  try {
    const response = await apiClient.post<ApiResponse<CreateStateMasters>>(
      "/StateMaster/CreateStateMaster", 
      data,{
      headers: {
        Authorization: `Bearer ${token}`
      }});
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message);
  }
};


export const deleteState = async (id: number): Promise<ApiResponse<null>> => {
  try {
  const res=  await apiClient.delete(`/StateMaster/DeleteStateId/${id}`,
      {
      headers: {
        Authorization: `Bearer ${token}`
      }});
    
    // Manually create success response for 204
    return { success: true, message: res.data };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Delete failed');
  }
};


export const updateCountry = async (data: CreateStateMasters) => {
  const response = await apiClient.put(`/StateMaster/Update`, data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }});
  return response.data;
};



