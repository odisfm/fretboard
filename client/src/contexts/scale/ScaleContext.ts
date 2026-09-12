import { createContext } from "react";
import { type Scale } from "@fretboard/shared/src/types/scale.ts"

export type AccidentalPrefType = null | "sharps" | "flats"

type ScaleContextValue = {
    scale: Scale;
    setScale: (scale: Scale) => void;
    accidentalPref: AccidentalPrefType
    setAccidentalPref: (pref: AccidentalPrefType) => void;
    degreesToPitches: Set<number>[]
}

export const ScaleContext = createContext<ScaleContextValue | null>(null)
