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
import axiosInstance from "../../Hook/useAxios";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false);
  const navigate = useNavigate();

  // Function to login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const result = await axiosInstance.post("/users/login", {
        email,
        password,
      });
      const { accessToken, refreshToken, user: userData } = result.data;
      localStorage.setItem("userId", userData._id);

      setUser(userData);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      return userData.role;
    } finally {
      setLoading(false);
    }
  };

  // Function to get user profile
  const getProfile = async () => {
    const token = getAccessToken();
    console.log("Access Token on page reload:", token); // Debugging

    if (!token) {
      setUser(null);
      setLoading(false);
      console.log("No access token found. Navigating to login...");
      navigate("/login"); // Directly navigate to login if no token
      return;
    }

    try {
      const { data } = await axiosInstance.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("User profile fetched:", data.user); // Debugging
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching profile:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("Token is expired, attempting to refresh.");

        const refreshToken = getRefreshToken();
        console.log(
          "Using refresh token to refresh access token:",
          refreshToken
        );

        if (refreshToken) {
          try {
            const response = await axiosInstance.post("/users/refresh", {
              refreshToken,
            });
            const { accessToken: newAccessToken } = response.data;
            setAccessToken(newAccessToken);
            getProfile(); // Re-fetch the profile with the new token
          } catch (refreshError) {
            console.error("Refresh token expired or invalid:", refreshError);
            logout(); // Log the user out if refreshing failed
          }
        } else {
          logout();
        }
      } else {
        navigate("/login"); // Navigate to login for other errors
      }
    } finally {
      setLoading(false);
    }
  };

  // Check profile and tokens on component mount (page reload)
  useEffect(() => {
    const accessToken = getAccessToken();
    console.log("Access token on component mount:", accessToken); // Debugging

    if (accessToken) {
      // If there is an access token, try to fetch profile
      getProfile();
    } else {
      setLoading(false); // No token, stop loading
      console.log("No access token found during initial load.");
    }
  }, []);

  // Logout function
  const logout = () => {
    setLoading(true);
    removeAccessToken();
    removeRefreshToken();
    setUser(null);
    setLoggedOut(true);
    localStorage.removeItem("userId");
    setLoading(false);
    navigate("/login");
  };

  const value = {
    user,
    login,
    logout,
    loading,
    setUser,
    loggedOut,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};
