import {AuthContext} from "./AuthContext.tsx";
import {use} from "react";

export const useAuth = () => {
    const ctx = use(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}
