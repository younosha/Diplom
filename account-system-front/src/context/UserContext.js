import React, {
  useState,
  createContext,
  useMemo,
  useEffect,
  useContext,
} from "react";
import { requestUser } from "../api/main";
import { AuthContext } from "../context/AuthContext";

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const { token } = useContext(AuthContext);
  const getUser = async () => {
    const user = await requestUser(token);
    setUser(user.data);
  };


  useEffect(() => {
    getUser();
  },[token]);

  const contextValue = useMemo(
    () => ({
      getUser,
      user,
      token,
    }),
    [user]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
