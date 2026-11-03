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
  const [avatarVersion, setAvatarVersion] = useState(() => Date.now());

  function login(userData) {
    setUser(userData);

    setAvatarVersion(Date.now());

    localStorage.setItem("user", JSON.stringify(userData));
  }

  function logout() {
    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  function updateUserContext(newUserData) {
    setUser((previousUser) => {
      const mergedUser = {
        ...(previousUser || {}),
        ...(newUserData || {}),
      };

      localStorage.setItem("user", JSON.stringify(mergedUser));

      return mergedUser;
    });

    setAvatarVersion(Date.now());
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        avatarVersion,
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
