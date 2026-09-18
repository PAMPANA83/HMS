import axios from "axios";


export const apiClient = axios.create({
  baseURL:  "https://myhmsapi.runasp.net/api", 

  headers: {
    "Content-Type": "application/json",
  },
});