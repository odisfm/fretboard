import {createContext} from "react";

export type UserDetails = {
    email: string;
}

type AuthContextValue = {
    auth: boolean,
    setAuth: (auth: boolean) => void,
    userDetails: UserDetails | null,
    setUserDetails: (value: UserDetails) => void,
    logOut: () => void,
    isNewUser: boolean,
    setIsNewUser: (value: boolean) => void,
}

export const AuthContext = createContext<AuthContextValue | null>(null)
