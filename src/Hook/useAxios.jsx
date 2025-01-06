// src/Hook/useAxios.js
import axios from "axios";
import { getAccessToken, removeAccessToken } from "../../Utils"; // Utility functions

const useAxios = axios.create({
  baseURL: "https://backend-diagnostic-4.onrender.com", // API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach the token to headers for every request
useAxios.interceptors.request.use(
  (config) => {
    const token = getAccessToken(); // Get the access token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to the request
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 errors (unauthorized) and redirect to login
useAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      removeAccessToken(); // Clear token if unauthorized
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default useAxios;
