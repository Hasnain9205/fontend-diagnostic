import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  setAccessToken,
} from "../../Utils";

const useAxios = axios.create({
  baseURL: "https://backend-diagnostic-2.onrender.com/api",
  withCredentials: true,
});

// 🔹 Request Interceptor (Attach Access Token)
useAxios.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Response Interceptor (Handle Token Expiry & Refresh)
useAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔺 If Unauthorized (401) & Token Expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        console.log("Attempting token refresh...");
        const res = await axios.post(
          "https://backend-diagnostic-2.onrender.com/api/users/refreshToken",
          { token: refreshToken }
        );

        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return useAxios(originalRequest); // Retry the request
      } catch (err) {
        console.error(
          "Refresh Token Failed:",
          err.response?.data || err.message
        );
        removeAccessToken();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default useAxios;
