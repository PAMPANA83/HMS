import { apiClient } from "../api-client";
import{CreateCityDto} from "../models/City.dto";
import {ApiResponse} from "../models/country.dto";
const token = localStorage.getItem("token");
export const getCity = async () => {
  const response = await apiClient.get("/CityMaster/GetAllCityMasters", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const createCity = async (data: CreateCityDto):Promise<ApiResponse<CreateCityDto> >=> {
 
    try {
      const response = await apiClient.post<ApiResponse<CreateCityDto>>(
        "/CityMaster/CreateCityMaster", 
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message);
    }
};

export const deleteCity = async (id: number) => {
  const response = await apiClient.delete(`/CityMaster/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const getCitiesByState = async (id: number) => {
  const response = await apiClient.get(`/CityMaster/GetCityMasterById/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
