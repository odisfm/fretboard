import * as z from "zod"
import {useRef, useState} from "react";
import type {LoginRequestType, RegisterRequestType} from "@fretboard/shared/types/apiRequests";
import type {RegistrationFailure} from "@fretboard/shared/types/apiResponses";
import {Link, useNavigate} from "react-router";
import {useAuth} from "../../contexts/auth/useAuth.ts";
import Button from "../generic/Button.tsx";
import {PasswordSchema} from "@fretboard/api/src/types/password.ts";
import {PasswordValidHint} from "./PasswordValidHint.tsx";
import {useUserData} from "../../contexts/userData/useUserData.tsx";

type Mode = "login" | "register"

const inputStyles = `bg-black p-1 rounded-md mb-2`
const legendStyles = `font-light text-white/80 mb-1`

let badPasswordFeatures: string[] = [];
try {
    PasswordSchema.parse("")
} catch (e) {
    const zError = e as z.ZodError
    badPasswordFeatures = zError.issues.map(x => x.message)
}

export function AuthPage({mode}: {mode: Mode}) {
    const authContext = useAuth()
    const userData = useUserData()
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [errorText, setErrorText] = useState<string>("");
    const [newPasswordIssues, setNewPasswordIssues] = useState<string[]>([...badPasswordFeatures])
    const [canSubmit, setCanSubmit] = useState<boolean>(false);
    const [waitForServer, setWaitForServer] = useState<boolean>(false);

    async function submit() {
        if (!emailRef.current || !passwordRef.current) return
        setWaitForServer(true)

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
            let body
            if (mode === "login") {
                body = JSON.stringify({email: email, password: password} satisfies LoginRequestType)
            } else if (mode === "register") {

                body = JSON.stringify({email: email, password: password, prefs: userData.prefs} satisfies RegisterRequestType)
            }

            const res = await fetch(url, {
                method: "POST",
                body: body,
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
                        if (json.error.message) {
                            setErrorText(json.error.message)
                        }
                    } else {
                        const json = await res.json()
                        console.error(json)
                        if (json?.error) {
                            setErrorText(json.error)
                        }
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
            setWaitForServer(false)

        } catch (e) {
            console.error(e)
            setWaitForServer(false)
        }
    }

    function validatePassword(password: string) {
        try {
            PasswordSchema.parse(password)
        } catch (e) {
            const zError = e as z.ZodError
            const issues = zError.issues.map(x => x.message)
            setNewPasswordIssues(issues)
            return issues
        }
        setNewPasswordIssues([])
        return []
    }

    function validateForm() {
        if (!emailRef.current || !passwordRef.current) return setCanSubmit(false)
        if (validatePassword(passwordRef.current.value).length === 0) return setCanSubmit(true)
        if (
            !z.email().validate(emailRef.current.value) ||
            !passwordRef.current.checkValidity() ||
            !passwordRef.current.value.length
        ) return setCanSubmit(false)
        if (mode === "register" && newPasswordIssues.length) return setCanSubmit(false)

        setCanSubmit(true)
    }

    return (
        <div className={`flex flex-col items-center`}>
            <div className={`flex flex-col gap-4 mt-8 w-full md:w-sm`}>
                <h1 className={`text-3xl font-bold`}>{mode === "login" ? "Log in" : "Register"}</h1>
                { errorText &&
                    <p className={`bg-red-900 p-2`}>
                        {errorText}
                    </p>
                }
                <form onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                }}>
                    <fieldset>
                        <legend className={legendStyles}>Email</legend>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            ref={emailRef}
                            className={inputStyles}
                            onChange={validateForm}
                        />
                    </fieldset>
                    <fieldset>
                        <legend className={legendStyles}>Password</legend>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            ref={passwordRef}
                            className={inputStyles}
                            onChange={(e) =>
                                {
                                    validatePassword(e.target.value)
                                    validateForm()
                                }
                            }
                        />
                    </fieldset>
                    { mode === "register" &&
                        <div className={`bg-black rounded-md p-2`}>
                            <PasswordValidHint badPasswordFeatures={badPasswordFeatures} passwordIssues={newPasswordIssues} />
                        </div>
                    }
                    <Button
                        styles={`mt-4 mb-2`}
                        disabled={!canSubmit}
                        loading={waitForServer}
                        variant={canSubmit ? "default" : "subtle"}
                        type={"submit"}
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