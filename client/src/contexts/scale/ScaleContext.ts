import { createContext } from "react";
import { type Scale } from "@fretboard/shared/types/scale"
import type {AccidentalPrefType, NoteLabelPrefScale} from "@fretboard/shared/types/userPrefs";

type ScaleContextValue = {
    scale: Scale;
    setScale: (scale: Scale) => void;
    accidentalPref: AccidentalPrefType
    setAccidentalPref: (pref: AccidentalPrefType) => void;
    degreesToPitches: Set<number>[],
    degreeNumbers: string[],
    intervalPref: NoteLabelPrefScale,
    setIntervalPref: (pref: NoteLabelPrefScale) => void,
    scaleSpelling: "sharps" | "flats"
}

export const ScaleContext = createContext<ScaleContextValue | null>(null)
