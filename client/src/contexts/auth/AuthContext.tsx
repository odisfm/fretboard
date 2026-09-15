import {createContext} from "react";

export type UserDetails = {
    email: string;
}

export type PendingSyncAction = "push" | "pull" | null;

export type AuthContextValue = {
    auth: boolean;
    authChecked: boolean;
    userDetails: UserDetails | null;
    pendingSyncAction: PendingSyncAction;
    clearPendingSyncAction: () => void;
    logIn: (userDetails: UserDetails) => void;
    signUp: (userDetails: UserDetails) => void;
    logOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null)
