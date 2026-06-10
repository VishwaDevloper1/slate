import {
    createContext,
    useContext,
    useState,
  } from "react";
import type { ReactNode } from "react";  
import { useEffect } from "react";
import api from "../services/api";

type User = {
    id: number;
    username: string;
    email: string;
  };
  
  type AuthContextType = {
    isLoggedIn: boolean;
    user: User | null;
    setUser: (user: User | null) => void;
    login: (token: string) => void;
    logout: () => void;
  };
  
  const AuthContext =
    createContext<AuthContextType | null>(
      null
    );
  
  export const AuthProvider = ({
    children,
  }: {
    children: ReactNode;
  }) => {
    const [isLoggedIn, setIsLoggedIn] =
      useState(
        !!localStorage.getItem("token")
      );
  
    const login = (token: string) => {
      localStorage.setItem(
        "token",
        token
      );
  
      setIsLoggedIn(true);
    };
  
    const logout = () => {
      localStorage.removeItem("token");
  
      setIsLoggedIn(false);
    };
    const [user, setUser] =
    useState<User | null>(null);
    useEffect(() => {

        const loadUser = async () => {
      
          const token =
            localStorage.getItem("token");
      
          if (!token) return;
      
          try {
      
            const response =
              await api.get(
                "/me",
                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`
                  }
                }
              );
      
            setUser(response.data);
      
            setIsLoggedIn(true);
      
          } catch {
      
            localStorage.removeItem(
              "token"
            );
      
            setUser(null);
      
            setIsLoggedIn(false);
          }
        };
      
        loadUser();
      
      }, []);
    return (
        <AuthContext.Provider
        value={{
          isLoggedIn,
          user,
          setUser,
          login,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => {
    const context =
      useContext(AuthContext);
  
    if (!context) {
      throw new Error(
        "useAuth must be used inside AuthProvider"
      );
    }
  
    return context;
  };