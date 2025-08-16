"use client";
import { createContext, useState, useEffect, useCallback } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    loading: true
  });

  // Initialize auth state from storage
  const initializeAuth = useCallback(() => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      const storedUser = localStorage.getItem("user");
      const adminToken = localStorage.getItem("adminToken");
      const userToken = localStorage.getItem("token");

      if (adminToken) {
        // Admin authentication takes precedence
        setAuthState({
          user: storedUser ? JSON.parse(storedUser) : { isAdmin: true },
          isAuthenticated: true,
          isAdmin: true,
          loading: false
        });
      } else if (userToken) {
        // Regular user authentication
        const userData = storedUser ? JSON.parse(storedUser) : null;
        setAuthState({
          user: userData,
          isAuthenticated: true,
          isAdmin: false,
          loading: false
        });
      } else {
        // No authentication found
        setAuthState({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          loading: false
        });
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      // Clear invalid auth data
      localStorage.removeItem("user");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("token");
      setAuthState({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false
      });
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback((userData, isAdminLogin = false, token = null) => {
    try {
      if (isAdminLogin) {
        if (!token) throw new Error("Admin token is required");
        localStorage.setItem("adminToken", token);
        localStorage.removeItem("token"); // Clear regular user token if exists
      } else {
        if (!userData) throw new Error("User data is required");
        localStorage.setItem("user", JSON.stringify(userData));
        if (token) localStorage.setItem("token", token);
        localStorage.removeItem("adminToken"); // Clear admin token if exists
      }

      setAuthState({
        user: userData || { isAdmin: true },
        isAuthenticated: true,
        isAdmin: isAdminLogin,
        loading: false
      });
    } catch (error) {
      console.error("Login error:", error);
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("nextauth.message")
    setAuthState({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: false
    });
  }, []);

  return (
    <UserContext.Provider value={{ 
      ...authState,
      login, 
      logout,
      initializeAuth
    }}>
      {children}
    </UserContext.Provider>
  );
}