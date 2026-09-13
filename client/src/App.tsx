import FretboardDemo from "./FretboardDemo.tsx";
import {TuningProvider} from "./contexts/tuning/TuningProvider.tsx";
import {ScaleProvider} from "./contexts/scale/ScaleProvider.tsx";
import {UserDataProvider} from "./contexts/userData/UserDataProvider.tsx";

export function App() {

    return (
        <div className={`w-[100vw] p-4`}>
            <UserDataProvider>
                <TuningProvider>
                    <ScaleProvider>
                        <FretboardDemo/>
                    </ScaleProvider>
                </TuningProvider>
            </UserDataProvider>
        </div>
    )
}

export default App
