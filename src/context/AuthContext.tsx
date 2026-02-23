import React, { createContext, useContext, useState, useEffect } from "react";
import { myPage } from "../api/userApi";
import { logout as logoutApi } from "../api/authApi";

interface AuthContextType {
  isLogin: boolean;
  userRole: string | null; 
  login: (role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogin, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await myPage(); 
        setIsLoggedIn(true);
        setUserRole(response.data.role);
      } catch (error) {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };
    checkAuth();
  }, []);

  const login = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const logout = async () => {
    try {
      await logoutApi(); 
      setIsLoggedIn(false);
      setUserRole(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLogin, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider 내부에서 사용되어야 합니다.");
  return context;
};