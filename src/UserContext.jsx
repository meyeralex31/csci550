import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
const UserContext = React.createContext({});

const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState();
  const [profileId, setProfileId] = useState();

  const setCookie = (name, value) => {
    const date = new Date();
    date.setTime(date.getTime() + 60 * 60 * 1000);
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };
  const getCookie = (name) => {
    const cookies = document.cookie.split(";");
    const usernameCookie = cookies.find((cookie) => {
      return cookie.startsWith(name);
    });
    return usernameCookie?.replace(name + "=", "");
  };

  useEffect(() => {
    try {
      const cookie = JSON.parse(getCookie("user") || "{}");
      setUserName(cookie?.username);
      setProfileId(cookie?.profileId);
    } catch (e) {
      console.error("Invalid cookie", e);
    }
  }, []);
  const signIn = (username, password) => {
    return axios
      .post("http://localhost:8080/login", { username, password })
      .then((res) => {
        setCookie(
          "user",
          JSON.stringify({ username, profileId: res?.data?.profileId })
        );
        setProfileId(res?.data?.profileId);
        setUserName(username);
      });
  };
  const register = (username, password, name) => {
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
    if (!!userName) return true;
    return !!getCookie("user");
  };
  return (
    <UserContext.Provider
      value={{ register, signIn, signOut, isSignedIn, userName, profileId }}
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
