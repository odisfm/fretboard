import {useMemo, useState} from "react";
import type {NoteName, Scale} from "@fretboard/shared/src/types/scale.ts";
import {type AccidentalPrefType, ScaleContext} from "./ScaleContext.ts";
import {allIndicesForNoteName} from "@fretboard/shared/src/utils/allIndicesForNoteName.ts";
import {indexForNoteName} from "@fretboard/shared/src/utils/indexForNoteName.ts";
import {midiPitchToNoteName} from "@fretboard/shared/src/utils/midiPitchToNoteName.ts";

const cMajor: Scale = {
    name: "C Major",
    intervals: [2, 2, 1, 2, 2, 2, 1],
    tonic: "C"
}

export function ScaleProvider({children}: {children: React.ReactNode}) {
    const [scale, setScale] = useState<Scale>(cMajor)
    const [accidentalPref, setAccidentalPref] = useState<AccidentalPrefType>(null);

    const degreesToPitches: Set<number>[] = useMemo(() => {
        const arr: Set<number>[] = []
        const tonicSet = allIndicesForNoteName(scale.tonic)
        arr.push(tonicSet)
        let lastNoteName = scale.tonic
        for (let i = 0; i < scale.intervals.length - 1; i++) {
            const degreeIndex = (indexForNoteName(lastNoteName) + scale.intervals[i]) % 12;
            lastNoteName = midiPitchToNoteName(degreeIndex, false) as NoteName
            const degreeSet = allIndicesForNoteName(lastNoteName)
            arr.push(degreeSet)
        }

        return arr
    }, [scale])

    return (
        <ScaleContext value={{
            scale,
            setScale,
            accidentalPref,
            setAccidentalPref,
            degreesToPitches
        }}>
            {children}
        </ScaleContext>
    )
}
