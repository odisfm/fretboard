import type {Chord, ChordShape} from "@fretboard/shared/types/chord";
import type {AccidentalPrefType} from "../scale/ScaleContext.ts";
import {createContext} from "react";

export type IntervalPrefType = "finger" | "note" | "interval"

type ChordContextValue = {
    chord: Chord,
    setChord: (chord: Chord) => void,
    accidentalPref: AccidentalPrefType
    setAccidentalPref: (pref: AccidentalPrefType) => void;
    toneNumbers: string[]
    tonesToPitches: Set<number>[],
    intervalPref: IntervalPrefType,
    setIntervalPref: (pref: IntervalPrefType) => void,
    chordSpelling: "sharps" | "flats"
    chordShape: ChordShape | null;
    setChordShape: (shape: ChordShape | null) => void,
    fretLabels: string[]
}

export const ChordContext = createContext<ChordContextValue | null>(null)
