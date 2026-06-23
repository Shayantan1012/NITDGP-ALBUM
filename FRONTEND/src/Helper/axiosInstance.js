import axios from "axios"
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5200",
  withCredentials: true,
  timeout: 15000,
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = "Unable to connect to the backend server"
    }
    return Promise.reject(error)
  },
)

export default axiosInstance;
