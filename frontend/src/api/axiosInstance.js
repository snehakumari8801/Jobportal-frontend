import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL:"https://jobportal-backend-be9i.onrender.com/api"
});

export default axiosInstance;