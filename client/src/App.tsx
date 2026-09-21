import TuningDemo from "./components/TuningDemo/TuningDemo.tsx";
import {useLocation, useNavigate} from "react-router";
import {ButtonGroup} from "./components/generic/ButtonGroup.tsx";
import {useFeature} from "./contexts/feature/useFeature.ts";

export function App({children}: {children: React.ReactNode}) {
    const location = useLocation()
    const pathname = location.pathname
    const navigate = useNavigate()
    const featureContext = useFeature()
    return (
        <div className={`flex flex-col gap-2 min-w-0`}>
            <div className={`flex items-start gap-2 min-w-0`}>
                <ButtonGroup
                    styles={`text-xl px-8`}
                    onClick={(i) => {
                        if (i === 0) {
                            featureContext.setFeature("scale")
                            navigate("/scale")
                        } else {
                            featureContext.setFeature("chord")
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