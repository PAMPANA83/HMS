import { apiClient } from "../api-client";
import{CreateUserDto} from "../models/User.dto";
import {ApiResponse} from "../models/country.dto";

export const UserLoginService = {
  login: async (username: string, password: string) => {
    try {
      const response = await apiClient.get(`/AccountMaster/Login/${username}/${password}`);
      return response.data;
    } catch {
      throw new Error("Login failed");
    }
  },
};


export const UserLogoutService = {
  logout: async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return null;
      }

      const response = await apiClient.post(
        "/Auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
localStorage.removeItem("token");
    localStorage.removeItem("user");

  

    window.location.replace("/");
      return response.data;

    } catch (error) {
      console.error("Logout API failed:", error);
      throw error;
    }
  },
};


export const createuser = async (
  data: CreateUserDto
): Promise<ApiResponse<CreateUserDto>> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found");
    }

    const response = await apiClient.post<ApiResponse<CreateUserDto>>(
      "/UserMaster/CreateUser",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(error?.response?.data || error);

    throw new Error(
      error?.response?.data?.message || "User creation failed"
    );
  }
};

export const deleteUser = async (id: number): Promise<ApiResponse<null>> => {
  try {
     const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found");
    }
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

export const getUser = async () => {
   const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found");
    }
  const response = await apiClient.get("/UserMaster/AllUserDetails",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }});
  return response.data;
};

export const uploadImage = async (file: File) => {
   const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found");
    }

    const formData = new FormData();
    formData.append("file", file);

  const response = await apiClient.post("/FtpUpload/image", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
};

export const GetUserbyID = async (id: number): Promise<ApiResponse<null>> => {
  try {
    const token = localStorage.getItem("token");
  const res=  await apiClient.get(`/UserMaster/GetUserById/${id}`,
      {
      headers: {
        Authorization: `Bearer ${token}`
      }});
    
   
    return { success: true, message: JSON.stringify(res.data) };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Delete failed');
  }
};