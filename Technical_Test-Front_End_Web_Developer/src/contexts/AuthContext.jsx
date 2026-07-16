"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { mockUsers } from "@/data/mock";

const AuthContext = createContext(undefined);

function readStoredUser() {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("halogold_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem("halogold_user");
    return null;
  }
}

function simulateDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const login = useCallback(async (email, password) => {
    await simulateDelay(600);
    const found = mockUsers.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error("Email atau password salah");
    // eslint-disable-next-line no-unused-vars
    const { password: _pw, ...safe } = found;
    localStorage.setItem("halogold_user", JSON.stringify(safe));
    setUser(safe);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("halogold_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
