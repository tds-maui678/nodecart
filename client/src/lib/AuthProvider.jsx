import { createContext, useContext, useEffect, useState } from "react";
import api from "../api"; // axios instance with baseURL + withCredentials



const AuthCtx = createContext({ user: null, setUser: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get("/api/auth/me");
        if (mounted) setUser(data);
      } catch {
        
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) return null; 

  return (
    <AuthCtx.Provider value={{ user, setUser }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}