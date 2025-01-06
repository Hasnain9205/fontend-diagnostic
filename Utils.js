// src/Utils/index.js
import { jwtDecode } from "jwt-decode";

// Get access token from localStorage
export const getAccessToken = (key = "accessToken") => {
  const token = localStorage.getItem(key);
  if (token) {
    return token;
  }
  return null;
};

// Decode the JWT token
export const decodeToken = (token) => {
  try {
    return jwtDecode(token); // Decode the token
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

// Set access token in localStorage
export const setAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
};

// Remove access token from localStorage
export const removeAccessToken = () => {
  localStorage.removeItem("accessToken");
};

// Get refresh token from localStorage
export const getRefreshToken = (key = "refreshToken") => {
  const token = localStorage.getItem(key);
  if (token) {
    return token;
  }
  return null;
};

// Set refresh token in localStorage
export const setRefreshToken = (token) => {
  localStorage.setItem("refreshToken", token);
};

// Remove refresh token from localStorage
export const removeRefreshToken = () => {
  localStorage.removeItem("refreshToken");
};
