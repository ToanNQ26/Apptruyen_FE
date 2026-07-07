// src/context/AuthContext.tsx

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { User } from "../models";
import { getUserInfo } from "../services/user.service";

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  loginauth: (token: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getUserInfo();
        setUser(res.result);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const loginauth = async (token: string) => {
    localStorage.setItem("token", token);
    const res = await getUserInfo();
    setUser(res.result);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loginauth,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};