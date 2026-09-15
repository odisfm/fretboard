import {useRef} from "react";
import type {LoginRequestType} from "@fretboard/shared/types/apiRequests";
import type {RegistrationFailure} from "@fretboard/shared/types/apiResponses";
import {Link, useNavigate} from "react-router";
import {useAuth} from "../../contexts/auth/useAuth.ts";
import Button from "../generic/Button.tsx";

type Mode = "login" | "register"

const inputStyles = `bg-black p-1 rounded-md mb-2`
const legendStyles = `font-light text-white/80 mb-1`

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
        <div className={`flex flex-col items-center`}>
            <div className={`flex flex-col gap-4 mt-8 w-full md:w-sm`}>
                <h1 className={`text-3xl font-bold`}>{mode === "login" ? "Log in" : "Register"}</h1>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                }}>
                    <fieldset>
                        <legend className={legendStyles}>Email</legend>
                        <input type="email" name="email" id="email" ref={emailRef} className={inputStyles} />
                    </fieldset>
                    <fieldset>
                        <legend className={legendStyles}>Password</legend>
                        <input type="password" name="password" id="password" ref={passwordRef} className={inputStyles} />
                    </fieldset>
                    <Button
                        styles={`mt-4 mb-2`}
                    >
                        {mode === "login" && "Login"}
                        {mode === "register" && "Register"}
                    </Button>
                </form>
                {mode === "login" && <span>Or <Link to={"/register"} className={`font-bold`}>create an account</Link></span>}
                {mode === "register" && <span>Or <Link to={"/login"} className={`font-bold`}>log in</Link></span>
                }</div>
        </div>
    )
}