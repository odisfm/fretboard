import {createContext} from "react";

type AudioContextValue = {
    playNote: (pitch: string, length?: string) => void;
}

export const AudioContext = createContext<AudioContextValue | null>(null)
