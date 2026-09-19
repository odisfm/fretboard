import TuningDemo from "./components/TuningDemo/TuningDemo.tsx";
import {useLocation, useNavigate} from "react-router";
import {ButtonGroup} from "./components/generic/ButtonGroup.tsx";

export function App({children}: {children: React.ReactNode}) {
    const location = useLocation()
    const pathname = location.pathname
    const navigate = useNavigate()
    return (
        <div className={`flex flex-col gap-2`}>
            <div className={`flex items-center gap-2`}>
                <ButtonGroup
                    styles={`text-xl px-8`}
                    onClick={(i) => {
                        if (i === 0) {
                            navigate("/scale")
                        } else {
                            navigate("/chord")
                    }}}
                    _children={["Scales", "Chords"]}
                    active={(() => {
                        if (pathname.startsWith("/scale")) return 0
                        if (pathname.startsWith("/chord")) return 1
                    })()}
                />
            </div>
            <TuningDemo/>
            {children}
        </div>
    )
}