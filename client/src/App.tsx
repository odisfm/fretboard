import {UserDataProvider} from "./contexts/userData/UserDataProvider.tsx";
import {AudioProvider} from "./contexts/audio/AudioProvider.tsx";
import {NetworkStatus} from "./components/NetworkStatus.tsx";
import {Outlet, useNavigate} from "react-router";
import {useAuth} from "./contexts/auth/useAuth.ts";
import Button from "./components/generic/Button.tsx";

export function App() {
    const authContext = useAuth()
    const navigate = useNavigate()

    return (
            <UserDataProvider>
                <div className={`w-[100vw]`}>
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
                    <AudioProvider>
                        <div className={`p-4`}>
                            <Outlet/>
                        </div>
                    </AudioProvider>
                </div>
            </UserDataProvider>
    )
}

export default App
