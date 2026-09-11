import { apiClient } from "../api-client";
import{CreateCompanyDto} from "../models/Company.dto";
const token = localStorage.getItem("token");
export const getCompany = async () => {
  const response = await apiClient.get("/CompanyMaster/GetAllCompanyMasters", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const createCompany = async (data: CreateCompanyDto) => {
  const response = await apiClient.post("/CompanyMaster/CreateCompany", data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteCompany = async (id: number) => {
  const response = await apiClient.delete(`/CompanyMaster/DeleteCompanyId/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};