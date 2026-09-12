import {TuningProvider} from "./contexts/tuning/TuningProvider.tsx";
import TuningDemo from "./components/TuningDemo/TuningDemo.tsx";

export function App() {

  return (
    <>
        <TuningProvider>
            <TuningDemo/>
        </TuningProvider>
    </>
  )
}

export default App
