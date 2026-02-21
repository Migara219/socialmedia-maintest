import { NavigateFunction } from "react-router-dom";
import axios from "axios";

export const handleSessionExpired = (navigate: NavigateFunction) => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  alert("Your session has expired. Please login again.");
  navigate("/auth/login");
};

export const refreshToken = async () => {
  try {
    const response = await axios.post('http://localhost:8080/auth/refresh', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const newToken = response.data.token;
    localStorage.setItem('token', newToken);
    return newToken;
  } catch (error) {
    throw error;
  }
};

export const checkAuthError = async (err: any, navigate: NavigateFunction) => {
  if (err.response?.status === 401) {
    try {
      // Try to refresh the token
      await refreshToken();
      return false; // Allow retry with new token
    } catch (refreshError) {
      // If refresh fails, handle session expiration
      handleSessionExpired(navigate);
      return true;
    }
  }
  return false;
};

export const handleLogout = (navigate: NavigateFunction) => {
  // Clear all authentication data
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  
  // Redirect to login
  navigate("/auth/login");
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const requireAuth = (navigate: NavigateFunction) => {
  if (!isAuthenticated()) {
    navigate("/auth/login");
    return false;
  }
  return true;
}; 