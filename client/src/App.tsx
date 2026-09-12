import FretboardDemo from "./FretboardDemo.tsx";
import {TuningProvider} from "./contexts/tuning/TuningProvider.tsx";
import {ScaleProvider} from "./contexts/scale/ScaleProvider.tsx";

export function App() {

    return (
        <div className={`w-[100vw] p-4`}>
            <TuningProvider>
                <ScaleProvider>
                    <FretboardDemo />
                </ScaleProvider>
            </TuningProvider>
        </div>
    )
}

export default App
