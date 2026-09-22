import { createContext } from "react";
import type {Scale, ScaleShape} from "@fretboard/shared/types/scale";
import type {Tuning} from "@fretboard/shared/types/tuning";
import type {Chord, ChordShape} from "@fretboard/shared/types/chord";
import type {UserPrefType} from "@fretboard/shared/types/userPrefs";

type UserDataContextValue = {
    scales: Scale[]
    addScale: (scale: Scale) => void
    tunings: Tuning[]
    createTuning: (tuning: Tuning) => Promise<Tuning | void>
    deleteTuning: (tuning: Tuning) => Promise<void>
    updateTuning: (tuning: Tuning) => void
    scaleShapes: ScaleShape[]
    chordShapes: ChordShape[]
    chords: Chord[]
    connectionStatus: boolean
    initialised: boolean,
    toggleSavedScaleShape: (shape: ScaleShape) => void,
    toggleSavedChordShape: (shape: ChordShape) => void,
    toggleSavedChord: (chord: Chord) => void,
    waitOnServer: boolean,
    prefs: UserPrefType,
    setPrefs: (value: UserPrefType) => void,
}

export const UserDataContext = createContext<UserDataContextValue | null>(null)
