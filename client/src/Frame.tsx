import {UserDataProvider} from "./contexts/userData/UserDataProvider.tsx";
import {AudioProvider} from "./contexts/audio/AudioProvider.tsx";
import {Outlet, useLocation} from "react-router";
import {Header} from "./components/global/Header.tsx";
import {Footer} from "./components/global/Footer.tsx";
import {FeatureProvider} from "./contexts/feature/FeatureProvider.tsx";

export function Frame() {
    const location = useLocation();
    const pathname = location.pathname;
    return (
            <UserDataProvider>
                <div className={`max-w-[100vw] min-w-0`}>
                    <Header />
                    <FeatureProvider initialFeature={pathname.startsWith("/chord") ? "chord" : "scale"}>
                    <AudioProvider>
                        <div className={`p-4`}>
                            <Outlet/>
                        </div>
                    </AudioProvider>
                    </FeatureProvider>
                    <Footer />
                </div>
            </UserDataProvider>
    )
}

export default Frame
