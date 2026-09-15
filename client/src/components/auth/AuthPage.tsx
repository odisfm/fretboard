import {useRef} from "react";
import type {LoginRequestType} from "@fretboard/shared/types/apiRequests";
import type {RegistrationFailure} from "@fretboard/shared/types/apiResponses";
import {Link, useNavigate} from "react-router";
import {useAuth} from "../../contexts/auth/useAuth.ts";

type Mode = "login" | "register"

export function AuthPage({mode}: {mode: Mode}) {
    const authContext = useAuth()
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    async function submit() {
        if (!emailRef.current || !passwordRef.current) return

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        let url = `${import.meta.env.VITE_API_URL}/auth/`
        switch (mode) {
            case "login":
                url += "login"
                break
            case "register":
                url += "register"
        }
        try {
            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify({email: email, password: password} satisfies LoginRequestType),
                credentials: "include",
            })

            if (!res.ok) {
                if (res.status === 500) {
                    console.error(res) // todo:
                } else if (res.status >= 400 && res.status < 500) {
                    console.error(res)
                    // todo:
                    if (mode === "register") {
                        const json: RegistrationFailure = await res.json()
                        console.error(json.error.message)
                        console.error(json.error)
                    } else {
                        const json = await res.json()
                        console.error(json)
                    }
                }
            } else {
                const json = await res.json()
                if (mode === "register") {
                    authContext.signUp({email: json.email})
                } else {
                    authContext.logIn({email: json.email})
                }
                navigate("/")
            }

        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
            <h1>{mode === "login" ? "Log in" : "Register"}</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                submit();
            }}>
                <fieldset>
                    <legend>email</legend>
                    <input type="email" name="email" id="email" ref={emailRef}/>
                </fieldset>
                <fieldset>
                    <legend>Password</legend>
                    <input type="password" name="password" id="password" ref={passwordRef}/>
                </fieldset>
                <button>
                    {mode === "login" && "Login"}
                    {mode === "register" && "Register"}
                </button>
            </form>
            {mode === "login" && <span>Or <Link to={"/register"}>create an account</Link></span>}
            {mode === "register" && <span>Or <Link to={"/login"}>log in</Link></span>
            }
        </>
    )
}