import FretboardDemo from "./FretboardDemo.tsx";
import {UserDataProvider} from "./contexts/userData/UserDataProvider.tsx";
import {AudioProvider} from "./contexts/audio/AudioProvider.tsx";
import {NetworkStatus} from "./components/NetworkStatus.tsx";

export function App() {

    return (
        <UserDataProvider>
            <div className={`w-[100vw]`}>
                <header className={`bg-black p-2 flex gap-2`}>
                    <span className={`font-bold text-lg`}>fretboard</span>
                    <NetworkStatus/>
                </header>
                <AudioProvider>
                    <div className={`p-4`}>
                        <FretboardDemo/>
                    </div>
                </AudioProvider>
            </div>
        </UserDataProvider>

    )
}

export default App
