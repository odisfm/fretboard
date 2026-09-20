import type {Chord, ChordShape} from "@fretboard/shared/types/chord";
import {createContext} from "react";
import type {AccidentalPrefType, NoteLabelPrefChord} from "@fretboard/shared/types/userPrefs";

type ChordContextValue = {
    chord: Chord,
    setChord: (chord: Chord) => void,
    accidentalPref: AccidentalPrefType
    setAccidentalPref: (pref: AccidentalPrefType) => void;
    toneNumbers: string[]
    tonesToPitches: Set<number>[],
    intervalPref: NoteLabelPrefChord,
    setIntervalPref: (pref: NoteLabelPrefChord) => void,
    chordSpelling: "sharps" | "flats"
    chordShape: ChordShape | null;
    setChordShape: (shape: ChordShape | null) => void,
    fretLabels: string[]
}

export const ChordContext = createContext<ChordContextValue | null>(null)
