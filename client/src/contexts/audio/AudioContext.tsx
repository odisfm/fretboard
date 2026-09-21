import {createContext} from "react";

type AudioContextValue = {
    playNote: (pitch: string, length?: string) => void;
    playNotes: (pitches: string[], length?: string, space?: number, chord?: boolean) => void;
    releaseAll: () => void;
}

export const AudioContext = createContext<AudioContextValue | null>(null)
