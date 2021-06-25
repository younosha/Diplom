import React, { useState, createContext, useMemo } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const tokenValue = localStorage.getItem("token");
  const [token, setToken] = useState(tokenValue);
  const isAuth = useMemo(() => !!token, [token]);
  const logInHandle = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
  };
  const logOutHandle = () => {
    setToken(null);
    localStorage.removeItem("token");
  };
  const contextValue = useMemo(
    () => ({
      isAuth,
      logInHandle,
      logOutHandle,
      token
    }),
    [isAuth, token]
  );
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
