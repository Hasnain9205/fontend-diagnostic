import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../Hook/useAxios";
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../../../Utils";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Login Function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await useAxios.post("/users/login", { email, password });
      const { accessToken, refreshToken, user: userData } = response.data;

      setUser(userData);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      return userData.role;
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Get User Profile
  const getProfile = async () => {
    try {
      setLoading(true);
      const response = await useAxios.get("/users/profile", {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error(
        "Profile Fetch Error:",
        error.response?.data || error.message
      );
      logout();
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Refresh Token Handler
  const handleTokenRefresh = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        console.warn("No refresh token available.");
        logout();
        return;
      }

      console.log("Refreshing token...");
      const response = await useAxios.post("/users/refreshToken", {
        token: refreshToken,
      });

      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        await getProfile();
      } else {
        console.warn("Refresh token expired or invalid.");
        logout();
      }
    } catch (error) {
      console.error(
        "Token Refresh Error:",
        error.response?.data || error.message
      );
      logout();
    }
  };

  // 🔹 Logout Function
  const logout = () => {
    removeAccessToken();
    removeRefreshToken();
    setUser(null);
    navigate("/login");
    setLoading(false);
  };

  // 🔹 Authentication Check
  const checkAuth = async () => {
    const token = getAccessToken();
    if (token) {
      await getProfile();
    } else {
      console.warn("Access token missing, trying refresh...");
      await handleTokenRefresh();
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // 🔹 Show Loading Spinner
  if (loading)
    return (
      <div className="centered-spinner">
        <div className="spinner"></div>
      </div>
    );

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
