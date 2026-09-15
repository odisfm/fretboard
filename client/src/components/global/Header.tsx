import {NetworkStatus} from "../NetworkStatus.tsx";
import Button from "../generic/Button.tsx";
import {useAuth} from "../../contexts/auth/useAuth.ts";
import {Link, useNavigate} from "react-router";

export function Header() {
    const authContext = useAuth()
    const navigate = useNavigate()
    return (
        <header className={`bg-black p-2 flex gap-2`}>
            <Link to={"/"} className={`mr-auto py-1 px-2 rounded-md hover:bg-neutral-800`}>
                <h1 className={`font-bold text-lg`}>fretboard</h1>
            </Link>
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