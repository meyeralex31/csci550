import React, { useContext, useState } from "react";
import axios from "axios";
const UserContext = React.createContext({});
const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState();
  const signIn = (userName, password) => {
    return axios
      .post("http://localhost:8080/login", { userName, password })
      .then((res) => {
        setUserName(userName);
      });
  };
  const register = (username, password, name) => {
    debugger;
    return axios
      .post("http://localhost:8080/signup", {
        username,
        name,
        password,
        profileId: Math.random() * 1000,
      })
      .then((res) => {
        setUserName(userName);
      });
  };
  const signOut = () => {
    setUserName(null);
  };
  const isSignedIn = () => {
    return !!userName;
  };
  return (
    <UserContext.Provider
      value={{ register, signIn, signOut, isSignedIn, userName }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  return useContext(UserContext);
};

export default UserProvider;
export { useUser };
