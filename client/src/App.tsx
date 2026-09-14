import FretboardDemo from "./FretboardDemo.tsx";
import {UserDataProvider} from "./contexts/userData/UserDataProvider.tsx";
import {AudioProvider} from "./contexts/audio/AudioProvider.tsx";

export function App() {

    return (
        <div className={`w-[100vw] p-4`}>
            <UserDataProvider>
                <AudioProvider>
                    <FretboardDemo/>
                </AudioProvider>
            </UserDataProvider>
        </div>
    )
}

export default App
