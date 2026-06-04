import { createContext, useState, useEffect } from "react";

let logoutTimer;

const initialAuthState = {
  isLoggedIn: false,
  username: null,
  token: null,
};

export const AuthContext = createContext(initialAuthState);

function getTokenExpiration(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export const useAuth = () => {
  const [authState, setAuthState] = useState(initialAuthState);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);
  const storedData = localStorage.getItem("userData");

  const logout = () => {
    localStorage.removeItem("userData");
    setAuthState(initialAuthState);
  };

  useEffect(() => {
    if (authState.token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - Date.now();
      logoutTimer = setTimeout(() => {
        logout();
      }, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [authState.token, logout, tokenExpirationDate]);

  if (storedData) {
    const { username, token, tokenExpiration } = JSON.parse(storedData);
    const isExpired = tokenExpiration && Date.now() > tokenExpiration;
    if (isExpired) {
      localStorage.removeItem("userData");
    } else if (token && !authState.isLoggedIn) {
      setAuthState({
        isLoggedIn: true,
        username,
        token,
      });
    }
  }

  const login = (username, token) => {
    const tokenExpiration = getTokenExpiration(token);
    setTokenExpirationDate(tokenExpiration ? new Date(tokenExpiration) : null);
    localStorage.setItem(
      "userData",
      JSON.stringify({ username, token, tokenExpiration }),
    );
    setAuthState((prevState) => ({
      ...prevState,
      isLoggedIn: !!token,
      username,
      token,
    }));
  };

  return {
    isLoggedIn: authState.isLoggedIn,
    username: authState.username,
    token: authState.token,
    login,
    logout,
  };
};
