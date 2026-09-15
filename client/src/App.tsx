import {UserDataProvider} from "./contexts/userData/UserDataProvider.tsx";
import {AudioProvider} from "./contexts/audio/AudioProvider.tsx";
import {Outlet} from "react-router";
import {Header} from "./components/global/Header.tsx";

export function App() {

    return (
            <UserDataProvider>
                <div className={`w-[100vw]`}>
                    <Header />
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
