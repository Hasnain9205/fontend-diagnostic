import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../../../Utils";
import useAxios from "../../Hook/useAxios"; // Your Axios instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // Prevent multiple refreshes
  const navigate = useNavigate();

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await useAxios.post("/users/login", { email, password });
      const { accessToken, refreshToken, user: userData } = response.data;

      setUser(userData); // Set user data
      setAccessToken(accessToken); // Store access token
      setRefreshToken(refreshToken); // Store refresh token
      return userData.role;
    } catch (error) {
      console.error("Error fetching profile:", error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        await handleTokenRefresh(); // Refresh token if expired
      } else {
        logout(); // Logout if any other error occurs
      }
    } finally {
      setLoading(false);
    }
  };

  // Get user profile function
  const getProfile = async () => {
    setLoading(true);
    try {
      const token = getAccessToken();
      if (!token) throw new Error("No token available");

      const response = await useAxios.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching profile:", error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        await handleTokenRefresh(); // Refresh token if expired
      } else {
        logout(); // Logout if any other error occurs
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle token refresh
  const handleTokenRefresh = async () => {
    if (isRefreshing) return; // Prevent multiple refresh attempts at the same time
    setIsRefreshing(true);

    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        console.error("No refresh token available");
        logout();
        return;
      }

      console.log("Refreshing token with:", refreshToken);

      const response = await useAxios.post("/users/refreshToken", {
        refreshToken,
      });

      console.log("Token refresh response:", response.data);

      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken); // Store new access token
        await getProfile(); // Fetch the profile after the token refresh
      } else {
        console.error("Refresh token invalid or expired");
        logout(); // Log out if the refresh token is invalid
      }
    } catch (error) {
      console.error("Token refresh failed:", error.message);
      logout(); // Log out if token refresh fails
    } finally {
      setIsRefreshing(false);
    }
  };

  // Logout function
  const logout = () => {
    console.error("Token expired or invalid, logging out...");
    removeAccessToken();
    removeRefreshToken();
    setUser(null);
    setLoading(false);
    navigate("/login");
  };

  const checkAuth = async () => {
    try {
      const token = getAccessToken();
      if (token) {
        await getProfile(); // Fetch profile if token exists
      } else {
        setLoading(false); // Stop loading if no token exists
        navigate("/login"); // Navigate to login if no token
      }
    } catch (error) {
      console.error("Authentication check failed:", error.message);
      logout(); // Log out if there's an error
    }
  };

  useEffect(() => {
    checkAuth(); // Call checkAuth on mount
  }, []); // Empty dependency array to only run on component mount

  const value = { user, login, logout, loading };

  if (loading) return <div>Loading...</div>; // You can replace this with a loading spinner or any UI component

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
