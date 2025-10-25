import React, { createContext, useState, useContext, useEffect } from 'react'; // Added useEffect
import { useLocation, Navigate } from 'react-router-dom';

// 1. Create the Auth Context
const AuthContext = createContext();

// 2. Create the Auth Provider
export const AuthProvider = ({ children }) => {
  // Check localStorage initially
  const [token, setToken] = useState(localStorage.getItem('matchpoint-token')); // Consistent key

  // Sync state changes back to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('matchpoint-token', token);
    } else {
      localStorage.removeItem('matchpoint-token');
    }
  }, [token]);

  // Login function
  const login = (newToken) => {
    setToken(newToken);
  };

  // Logout function
  const logout = () => {
    setToken(null);
  };

  // Shared value
  const value = {
    token,
    isLoggedIn: !!token, // Boolean check
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Custom hook for easy access
export const useAuth = () => {
  return useContext(AuthContext);
};

// 4. Helper component to protect pages
export const RequireAuth = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to the correct login path
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Render the child component (the protected page)
  return children;
};

