import React, { useContext, useState } from "react";

const UserContext = React.createContext({});
const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState();
  const signIn = (userName) => {
    setUserName(userName);
  };
  const signOut = () => {
    setUserName(null);
  };
  const isSignedIn = () => {
    return !!userName;
  };
  return (
    <UserContext.Provider value={{ signIn, signOut, isSignedIn, userName }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  return useContext(UserContext);
};

export default UserProvider;
export { useUser };
