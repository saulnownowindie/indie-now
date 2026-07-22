import { createContext, useContext, useState } from "react";

import {
  getStoredUser,
  login as loginService,
  logout as logoutService,
} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());

  async function login(credentials) {
    const data = await loginService(credentials);

    setUser(data.user);

    return data;
  }

  function logout() {
    logoutService();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}