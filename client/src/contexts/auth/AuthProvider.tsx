import {useEffect, useState} from "react";
import {AuthContext, type UserDetails} from "./AuthContext.tsx";

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
    const [auth, setAuth] = useState<boolean>(false);
    const [isNewUser, setIsNewUser] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                    credentials: "include",
                })
                if (!res.ok) {
                    console.error(res)
                    return;
                }
                const json = await res.json()
                setUserDetails({email: json.email})
                setAuth(true)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [])

    async function logOut() {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            })
        } catch (e) {
            console.error(e)
        } finally {
            setAuth(false)
            setUserDetails(null)
            localStorage.removeItem("userDetails")
            localStorage.removeItem("scales")
            localStorage.removeItem("tunings")
            localStorage.removeItem("shapes")
        }
    }

    localStorage.setItem("userDetails", JSON.stringify(userDetails))

    return (
        <AuthContext value={{auth, setAuth, userDetails, setUserDetails, logOut, isNewUser, setIsNewUser}}>
            {children}
        </AuthContext>
    )
}