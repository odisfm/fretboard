import {UserDataProvider} from "./contexts/userData/UserDataProvider.tsx";
import {AudioProvider} from "./contexts/audio/AudioProvider.tsx";
import {Outlet} from "react-router";
import {Header} from "./components/global/Header.tsx";
import {Footer} from "./components/global/Footer.tsx";

export function Frame() {
    return (
            <UserDataProvider>
                <div className={`w-[100vw]`}>
                    <Header />
                    <AudioProvider>
                        <div className={`p-4`}>
                            <Outlet/>
                        </div>
                    </AudioProvider>
                    <Footer />
                </div>
            </UserDataProvider>
    )
}

export default Frame
