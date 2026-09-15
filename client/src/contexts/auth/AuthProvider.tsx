import {useCallback, useEffect, useMemo, useState} from "react";
import {AuthContext, type PendingSyncAction, type UserDetails} from "./AuthContext.tsx";

const API_URL = import.meta.env.VITE_API_URL;
const AUTH_CACHE_KEY = "authCache";

type AuthCache = {
    auth: boolean;
    userDetails: UserDetails | null;
}

function readAuthCache(): AuthCache {
    try {
        const raw = localStorage.getItem(AUTH_CACHE_KEY);
        if (!raw) return {auth: false, userDetails: null};
        const parsed = JSON.parse(raw);
        return {auth: Boolean(parsed.auth), userDetails: parsed.userDetails ?? null};
    } catch (e) {
        console.error("Failed to read auth cache", e);
        return {auth: false, userDetails: null};
    }
}

export function AuthProvider({children}: { children: React.ReactNode }) {

    const [authChecked, setAuthChecked] = useState<boolean>(false);
    const [pendingSyncAction, setPendingSyncAction] = useState<PendingSyncAction>(null);

    const [initialCache] = useState<AuthCache>(() => readAuthCache());

    const [auth, setAuth] = useState(initialCache.auth);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(
        initialCache.userDetails
    );

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const res = await fetch(`${API_URL}/auth/me`, {
                    credentials: "include",
                });

                if (cancelled) return;

                if (res.ok) {
                    const json = await res.json();

                    setUserDetails({email: json.email});
                    setAuth(true);

                    if (!initialCache.auth) {
                        setPendingSyncAction("pull");
                    }
                } else if (res.status === 401 || res.status === 403) {
                    setAuth(false);
                    setUserDetails(null);
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (!cancelled) setAuthChecked(true);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [initialCache.auth]);

    useEffect(() => {
        const cache: AuthCache = {auth, userDetails};
        localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(cache));
    }, [auth, userDetails]);

    const clearPendingSyncAction = useCallback(() => setPendingSyncAction(null), []);

    const logIn = useCallback((userDetails: UserDetails) => {
        setUserDetails({email: userDetails.email});
        setAuth(true);
        setPendingSyncAction("pull");
    }, []);

    const signUp = useCallback((userDetails: UserDetails) => {
        setUserDetails({email: userDetails.email});
        setAuth(true);
        setPendingSyncAction("push");
        return true;
    }, []);

    const logOut = useCallback(async () => {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (e) {
            console.error(e);
        } finally {
            setAuth(false);
            setUserDetails(null);
            setPendingSyncAction(null);
            localStorage.removeItem(AUTH_CACHE_KEY);
        }
    }, []);

    const value = useMemo(() => ({
        auth, authChecked, userDetails,
        pendingSyncAction, clearPendingSyncAction,
        logIn, signUp, logOut,
    }), [auth, authChecked, userDetails, pendingSyncAction, clearPendingSyncAction, logIn, signUp, logOut]);

    return (
        <AuthContext value={value}>
            {children}
        </AuthContext>
    )
}
