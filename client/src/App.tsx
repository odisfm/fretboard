import FretboardDemo from "./FretboardDemo.tsx";
import {UserDataProvider} from "./contexts/userData/UserDataProvider.tsx";

export function App() {

    return (
        <div className={`w-[100vw] p-4`}>
            <UserDataProvider>

                        <FretboardDemo/>
            </UserDataProvider>
        </div>
    )
}

export default App
