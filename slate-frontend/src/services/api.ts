import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // Points to your FastAPI engine port
});

// Request Interceptor: Automatically injects JWT into every outgoing request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Matches your auth context implementation
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;