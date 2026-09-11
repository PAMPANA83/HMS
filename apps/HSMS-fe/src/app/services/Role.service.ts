import { apiClient } from "../api-client";


const token = localStorage.getItem("token");
export const getRole = async () => {
  const response = await apiClient.get("/Roles/GetAllrole",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }});
  return response.data;
};


