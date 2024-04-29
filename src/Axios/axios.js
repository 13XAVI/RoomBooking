import axios from "axios";
import authService from "../componets/Services/authService";

const axiosInstance = axios.create({

  baseURL: process.env.APP_BASE_URL_SIGNIN,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  withCredentials: false,


}
)

export default axiosInstance