import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // 1. Force the system to start in a strict loading mode
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Safely read keys from disk on a browser hard-refresh
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Session corrupted, resetting...", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    
    // 3. ONLY allow components to view the screen after disk read finishes
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    // 4. Save your Spring Boot JWT token into storage strings
    if (token) {
      localStorage.setItem("token", token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}