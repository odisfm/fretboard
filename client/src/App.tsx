import FretboardDemo from "./components/Fretboard/FretboardDemo.tsx";
import {TuningProvider} from "./contexts/tuning/TuningProvider.tsx";

export function App() {

    return (
        <>
            <TuningProvider>
                <FretboardDemo />
            </TuningProvider>
        </>
    )
}

export default App
