import { apiClient } from "../api-client";
import{CreateBillingDto} from "../models/Billing.dto";
import {ApiResponse} from "../models/country.dto";
const token = localStorage.getItem("token");


export const createNewBilling = async (data: CreateBillingDto): Promise<ApiResponse<CreateBillingDto>> => {
  try {
    const response = await apiClient.post<ApiResponse<CreateBillingDto>>(
      "/BillingGen/create-billing", 
      data,{
      headers: {
        Authorization: `Bearer ${token}`
      }});
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message);
  }
};