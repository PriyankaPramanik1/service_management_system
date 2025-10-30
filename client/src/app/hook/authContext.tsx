"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  RegisterFormData,
  LoginCredentials,
  Services,
  BookingFormData,
} from "../interface/auth";
import axios from "axios";

interface AuthContextType {
  user: User | null;
  register: (
    formData: RegisterFormData
  ) => Promise<{ success: boolean; message: string }>;
  login: (
    credentials: LoginCredentials
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
  hasRole: (roles: string[]) => boolean;
  service: Services | null;
  isLogin: boolean;
  setIsLogin: (state: boolean) => void;
  booking: BookingFormData[] | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [service, setService] = useState<Services | null>(null);
  const [booking, setBooking] = useState<BookingFormData[] | null>(null);
  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsLogin(true);
        }
      } catch (error) {
        console.error("Error initializing auth state:", error);
        // Clear corrupted data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    initializeAuth();
  }, []);

  const register = async (
    formData: RegisterFormData
  ): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8400/create/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Registration failed",
        };
      }

      return { success: true, message: "User created successfully" };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "Error creating user" };
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    credentials: LoginCredentials
  ): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8400/login/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (response.redirected) {
        window.location.href = response.url;
        return { success: true, message: "Login successful" };
      }

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || "Login failed" };
      }

      // Store token and user data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setIsLogin(true);
      redirectBasedOnRole(data.user.role);
      return { success: true, message: "Login successful" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Error during login" };
    } finally {
      setLoading(false);
    }
  };
  //  console.log("user",user);
  const logout = async (): Promise<void> => {
    try {
      await fetch("http://localhost:8400/user/logout", {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear user state
      setUser(null);
      setIsLogin(false);

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Clear cookies
      ["adminToken", "userToken", "managerToken", "employeeToken"].forEach(
        (name) => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        }
      );
      window.location.href = "/login";
    }
  };

  const hasRole = (roles: string[]): boolean => {
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  };

  const redirectBasedOnRole = (role: string) => {
    const roleRoutes: { [key: string]: string } = {
      admin: "http://localhost:8400/admin/dashboard",
      manager: "http://localhost:8400/manager/dashboard",
      technician: "http://localhost:8400/technician/dashboard",
      user: "/",
    };
    window.location.href = roleRoutes[role] || "/dashboard";
  };

  // All service
  const fetchAllService = () => {
    axios
      .get("http://localhost:8400/get/service")
      .then((res) => {
        // console.log("Service response", res.data.data);
        setService(res.data.data);
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  // all booking
  const fetchAllBooking = () => {
    axios
      .get("http://localhost:8400/get/booking")
      .then((res) => {
        // console.log("booking", res.data);
        setBooking(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchAllService();
    fetchAllBooking();
  }, []);

  const value: AuthContextType = {
    user,
    register,
    login,
    logout,
    loading,
    hasRole,
    service,
    isLogin,
    setIsLogin,
    booking,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
