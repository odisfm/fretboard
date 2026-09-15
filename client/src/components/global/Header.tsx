import {NetworkStatus} from "../NetworkStatus.tsx";
import Button from "../generic/Button.tsx";
import {useAuth} from "../../contexts/auth/useAuth.ts";
import {useNavigate} from "react-router";

export function Header() {
    const authContext = useAuth()
    const navigate = useNavigate()
    return (
        <header className={`bg-black p-2 flex gap-2`}>
            <span className={`font-bold text-lg mr-auto`}>fretboard</span>
            <NetworkStatus/>
            { authContext.auth ?
                <Button onClick={authContext.logOut}>
                    log out
                </Button>
                :
                <Button onClick={() => navigate("/login")}>
                    log in
                </Button>
            }
        </header>
    )
}