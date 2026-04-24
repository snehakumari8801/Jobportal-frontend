// import axios from "axios";

// export const axiosInstance = axios.create({ 
//   baseURL: "http://localhost:5000/api",
//   //  baseURL:"https://jobportal-backend-111.onrender.com/api" 
//   });

// // // 👉 For non-API routes (files, uploads, etc.)
// // export const base = "https://jobportal-backend-111.onrender.com";











// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

// export default axiosInstance;










import axios from "axios";

// ✅ Base URL (for socket, files, etc.)
export const base = "https://jobportal-backend-111.onrender.com";
// export const base = "http://localhost:5000";


// ✅ API instance (for backend routes)
const axiosInstance = axios.create({
  baseURL: `${base}/api`,
});

export default axiosInstance;