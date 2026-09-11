import { apiClient } from "../api-client";
import { DepartmentDto } from "../models/Department.dto";
import {ApiResponse} from "../models/country.dto";

const token = localStorage.getItem("token");
export const getDepartment = async () => {
  const response = await apiClient.get("/DepartmentMaster/GetAllDepartment", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};



export const createDepartment = async (data: DepartmentDto):Promise<ApiResponse<DepartmentDto> >=> {
 
    try {
      const response = await apiClient.post<ApiResponse<DepartmentDto>>(
        "/DepartmentMaster/createDepartment", 
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if(response.status !== 200 && response.status !== 201) {
        throw new Error(`Failed to create department`);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message);
    }
};

export const updateDepartment = async (id: number, department: DepartmentDto) => {
  const response = await apiClient.put(`/DepartmentMaster/UpdateDistrict/${id}`, department, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if(response.status !== 200 && response.status !== 204) {
    throw new Error(`Failed to update department with id ${id}`);
  }
  return response.data;
};

export const deleteDepartment = async (id: number) => {
  const response = await apiClient.delete(`/DepartmentMaster/DeleteDistrictId/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}