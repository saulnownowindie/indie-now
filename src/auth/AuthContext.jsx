import { useState } from "react";

import { AuthContext } from "./authContext";

function getStoredUser() {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  function login(userData) {
    setUser(userData);

    localStorage.setItem("user", JSON.stringify(userData));
  }

  function logout() {
    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  function updateUserContext(newUserData) {
    setUser(newUserData);

    localStorage.setItem("user", JSON.stringify(newUserData));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUserContext,
        loading: false,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
