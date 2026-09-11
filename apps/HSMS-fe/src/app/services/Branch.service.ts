import { apiClient } from "../api-client";
import { CreateBranchDto,UpdateBranchDto } from "../models/Branch.dto";
const token = localStorage.getItem("token");
export const getBranch = async () => {
  const response = await apiClient.get("/BranchMaster/GetAllBranchMasters", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const createBranch = async (data: CreateBranchDto) => {
  const response = await apiClient.post("/BranchMaster/CreateBranchMaster", data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteBranch = async (id: number) => {
  const response = await apiClient.delete(`/BranchMaster/DeleteBranchMasterById/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateBranch = async (data: UpdateBranchDto) => {
  const response = await apiClient.put(`/BranchMaster/Update`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

