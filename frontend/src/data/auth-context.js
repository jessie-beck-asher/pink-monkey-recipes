import { createContext, useState } from "react";

const initialAuthState = {
    isLoggedIn: false,
    username: null
}

export const AuthContext = createContext(initialAuthState);

export const useAuth = () => {
    const [authState, setAuthState] = useState(initialAuthState);

    const login = (username) => {
        setAuthState(prevState => ({
            ...prevState,
            isLoggedIn: true,
            username
        }))
    }

    const logout = () => {
        setAuthState(initialAuthState);
    };

    return {
        isLoggedIn: authState.isLoggedIn,
        username: authState.username,
        login,
        logout,
    };
};

