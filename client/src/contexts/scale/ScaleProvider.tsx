import {useMemo, useState} from "react";
import type {NoteName, Scale} from "@fretboard/shared/types/scale";
import {type AccidentalPrefType, type IntervalPrefType, ScaleContext} from "./ScaleContext.ts";
import {allIndicesForNoteName} from "@fretboard/shared/utils/allIndicesForNoteName";
import {indexForNoteName} from "@fretboard/shared/utils/indexForNoteName";
import {midiPitchToNoteName} from "@fretboard/shared/utils/midiPitchToNoteName";
import getScaleDegreeNumbers from "../../formulas/getScaleDegreeNumbers.ts";
import {TONES, TONES_FLAT, TONES_SHARP} from "@fretboard/shared/consts";

export function ScaleProvider({initialScale, children}: {initialScale: Scale, children: React.ReactNode}) {
    const [scale, setScale] = useState<Scale>(initialScale)
    const [accidentalPref, setAccidentalPref] = useState<AccidentalPrefType>(null);
    const [intervalPref, setIntervalPref] = useState<IntervalPrefType>(null);

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

    const degreeNumbers: string[] = useMemo(() => {
        return getScaleDegreeNumbers(scale.intervals, intervalPref || "nashville")
    }, [scale.intervals, intervalPref])

    function _setAccidentalPref(accidentalPref: AccidentalPrefType) {
        let tones: string[]
        switch (accidentalPref) {
            case "sharps":
                tones = TONES_SHARP
                break
            case "flats":
                tones = TONES_FLAT
                break
            case null:
                tones = TONES
        }
        const newTonic = tones[indexForNoteName(scale.tonic)]
        setScale({
            ...scale,
            tonic: newTonic as NoteName
        })
        setAccidentalPref(accidentalPref)
    }

    return (
        <ScaleContext value={{
            scale,
            setScale,
            accidentalPref,
            setAccidentalPref: _setAccidentalPref,
            degreesToPitches,
            degreeNumbers,
            intervalPref,
            setIntervalPref
        }}>
            {children}
        </ScaleContext>
    )
}
