import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Crypto from "crypto-js";

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
      .post("http://localhost:8080/login", { username })
      .then((res) => {
        const { challenge, nonce, salt } = res.data;
        const passwordWithSalt = Crypto.enc.Base64.stringify(
          Crypto.SHA256(String(password + salt))
        );
        const key = Crypto.enc.Base64.stringify(
          Crypto.SHA256(String(passwordWithSalt + nonce))
        ).slice(0, 24);
        const expectedValue = Crypto.AES.decrypt(challenge, key).toString(
          Crypto.enc.Utf8
        );
        const object = JSON.parse(expectedValue);
        if (object.value1 && object.value2) {
          const encrypted = Crypto.AES.encrypt(
            JSON.stringify(object.value1 + object.value2),
            key
          ).toString();

          return axios
            .post("http://localhost:8080/login/challenge", {
              username,
              challengeResult: encrypted,
              nonce,
            })
            .then((res) => {
              setCookie(
                "user",
                JSON.stringify({ username, profileId: res?.data?.profileId })
              );
              setProfileId(res?.data?.profileId);
              setUserName(username);
            });
        } else {
          throw new Error("invalid login");
        }
      });
  };
  const register = (username, password, name) => {
    return axios
      .post("http://localhost:8080/signup", {
        username,
        name,
        password,
      })
      .then((res) => {
        setUserName(userName);
      });
  };
  const signOut = () => {
    setUserName(null);
  };
  const isSignedIn = () => {
    if (!!profileId) return true;
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
