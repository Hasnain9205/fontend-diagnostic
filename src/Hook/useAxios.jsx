import axios from "axios";
import {
  getAccessToken,
  removeAccessToken,
  getRefreshToken,
  setAccessToken,
} from "../../Utils"; // Utility functions

const useAxios = axios.create({
  baseURL: "http://localhost:5001/api", // API base URL, can be set in .env file
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

// Response Interceptor: Handle 401 errors (unauthorized), refresh the token, or redirect to login
useAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken(); // Retrieve refresh token
        const res = await axios.post(`http://localhost:5001/api/refreshToken`, {
          token: refreshToken,
        });
        const newAccessToken = res.data.accessToken;

        setAccessToken(newAccessToken); // Save the new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return useAxios(originalRequest); // Retry the original request with new token
      } catch (err) {
        removeAccessToken(); // Failed to refresh token, log out
        window.location.href = "/login"; // Redirect to login
        return Promise.reject(err);
      }
    }

    // Retry logic for 503 - Service Unavailable (temporary server issue)
    if (
      error.response &&
      error.response.status === 503 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      return useAxios(originalRequest); // Retry the request
    }

    // Log error response for debugging purposes
    if (error.response) {
      console.error("Error Response:", error.response);
    } else if (error.request) {
      console.error("Error Request:", error.request);
    } else {
      console.error("Error Message:", error.message);
    }

    return Promise.reject(error); // Reject the error
  }
);

export default useAxios;
