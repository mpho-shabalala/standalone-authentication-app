// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { AuthResponse, AuthState, ResponseMessage } from "../types";
import * as AuthService from '../services/authServices';

// mutable reference to always keep the latest value
export let authContextValue: AuthState | null = null;

// import type { AuthState, ResponseMessage } from '../types';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<ResponseMessage>;
  signup: (username: string, email: string, password: string, contacts: string) => Promise<ResponseMessage>;
  verifyUser: (token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<ResponseMessage>;
  logout: () => Promise<ResponseMessage>;
  resetPassword: (token: string, newPassword: string) => Promise<ResponseMessage>;

}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    email: null,
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
  });

  // Load from localStorage on startup
  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      setAuth(JSON.parse(stored));
    }
  }, []);

  // Keep global reference updated + persist in localStorage
  useEffect(() => {
    authContextValue = auth;
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  // LOGIN
  const login = async (username: string, password: string) : Promise<ResponseMessage> => {
    const res: AuthResponse = await AuthService.login({ username, password });
    const data = res.result.data ?? null;

    setAuth({
      email: null,
      user: data?.user ?? null,
      token: data?.token ?? null,
      refreshToken: data?.refreshToken ?? null,
      isAuthenticated: true,
    });

    return{
        success: true,
        message: res.result.message,
        statusCode: res.result.statusCode,
      }
  };

  // SIGNUP
  const signup = async (username: string, email: string, contacts: string, password: string) : Promise<ResponseMessage>  => {
    try{
      const res: AuthResponse = await AuthService.signup({username, email, contacts, password});
      const data = res.result.data;
      console.log(data?.user);
      setAuth({
        email: email,
        user: data?.user ?? null,
        token: null,
        refreshToken: null,
        isAuthenticated: false
      });

      return{
        success: true,
        message: res.result.message,
        statusCode: res.result.statusCode,
      }
    }catch(error: any){
      setAuth({
        email: email,
        user:  null,
        token: null,
        refreshToken: null,
        isAuthenticated: false
      });
      console.log(error)
      return{
      success: false,
      message: error?.response?.data.message,
      statusCode: error?.response?.data.statusCode,
    }
    }
  }

  //VERIFY USER
  const verifyUser = async (token: string) => {
    const res: AuthResponse = await AuthService.verifyUser(token);
    const data = res.result.data ?? null;

    setAuth({
      email: null,
      user: data?.user ?? null,
      token: data?.token ?? null,
      refreshToken: data?.refreshToken ?? null,
      isAuthenticated: true
    })
  }

  //FORGOT PASSWORD
  const forgotPassword = async (email: string) : Promise<ResponseMessage> => {
    const res: AuthResponse = await AuthService.forgotPassword(email);
    const data = res.result.data ?? null;

    setAuth({
      email: email,
      user : data?.user ?? null,
      token: null,
      refreshToken: null,
      isAuthenticated: false
    })

    return{
        success: true,
        message: res.result.message,
        statusCode: res.result.statusCode,
      }
  }

  //LOGOUT
  const logout = async () : Promise<ResponseMessage> => {
    const res: AuthResponse = await AuthService.logout();
    // const data = res.data ?? null;

    setAuth({
      email: null,
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false
    })

    return{
        success: true,
        message: res.result.message,
        statusCode: res.result.statusCode,
      }
  }

  //RESET PASSWORD
  const resetPassword = async (token: string, newPassword: string) : Promise<ResponseMessage> => {
    const res: AuthResponse = await AuthService.resetPassword({token, newPassword});
    setAuth({
      email: null,
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false
    })
    return{
        success: true,
        message: res.result.message,
        statusCode: res.result.statusCode,
      }
  }

  //REFRESH TOKEN

  return (
    <AuthContext.Provider value={{ ...auth, login, signup, verifyUser, forgotPassword, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
