import FretboardDemo from "./components/Fretboard/FretboardDemo.tsx";
import {TuningProvider} from "./contexts/tuning/TuningProvider.tsx";

export function App() {

    return (
        <div className={`w-[100vw] p-4`}>
            <TuningProvider>
                <FretboardDemo />
            </TuningProvider>
        </div>
    )
}

export default App
