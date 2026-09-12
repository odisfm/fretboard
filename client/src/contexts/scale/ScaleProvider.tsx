import {useState} from "react";
import type {Scale} from "@fretboard/shared/src/types/scale.ts";
import {type AccidentalPrefType, ScaleContext} from "./ScaleContext.ts";

const cMajor: Scale = {
    name: "C Major",
    intervals: [2, 2, 1, 2, 2, 2, 1],
    tonic: "C"
}

export function ScaleProvider({children}: {children: React.ReactNode}) {
    const [scale, setScale] = useState<Scale>(cMajor)
    const [accidentalPref, setAccidentalPref] = useState<AccidentalPrefType>(null);

    return (
        <ScaleContext value={{
            scale,
            setScale,
            accidentalPref,
            setAccidentalPref
        }}>
            {children}
        </ScaleContext>
    )
}
