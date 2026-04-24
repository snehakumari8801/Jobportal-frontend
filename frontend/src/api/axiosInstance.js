import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL:"https://jobportal-backend-12-vt48.onrender.com/api"
});

export default axiosInstance;