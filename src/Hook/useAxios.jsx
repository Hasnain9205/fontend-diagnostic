import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
} from "../../Utils";

const useAxios = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach access token
useAxios.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    console.log("accessToken....", accessToken);
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry and refresh the token
useAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get the refresh token from localStorage
        const refreshToken = getRefreshToken();
        console.log("refresh token....", refreshToken);
        if (!refreshToken) {
          return Promise.reject(error);
        }

        // Request a new access token using the refresh token
        const response = await axios.post(
          "http://localhost:5001/api/users/refreshToken",
          { refreshToken }
        );

        const newAccessToken = response.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken); // Store the new access token

        // Retry the original request with the new access token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return useAxios(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        removeAccessToken();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default useAxios;
