import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const storedUser = localStorage.getItem("holidaze_user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  function login(userData) {
    const { accessToken, ...profile } = userData;

    const session = {
      ...profile,
      accessToken,
    };

    localStorage.setItem("holidaze_user", JSON.stringify(session));
    setUser(session);
  }

  function logout() {
    localStorage.removeItem("holidaze_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user?.accessToken),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}