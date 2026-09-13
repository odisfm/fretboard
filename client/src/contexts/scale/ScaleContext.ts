import { createContext } from "react";
import { type Scale } from "@fretboard/shared/types/scale"

export type AccidentalPrefType = null | "sharps" | "flats"
export type IntervalPrefType = null | "nashville" | "interval"

type ScaleContextValue = {
    scale: Scale;
    setScale: (scale: Scale) => void;
    accidentalPref: AccidentalPrefType
    setAccidentalPref: (pref: AccidentalPrefType) => void;
    degreesToPitches: Set<number>[],
    degreeNumbers: string[],
    intervalPref: IntervalPrefType,
    setIntervalPref: (pref: IntervalPrefType) => void,
}

export const ScaleContext = createContext<ScaleContextValue | null>(null)
