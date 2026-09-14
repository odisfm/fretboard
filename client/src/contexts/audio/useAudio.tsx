import {AudioContext} from "./AudioContext.tsx";
import {use} from "react";

export function useAudio() {
    const ctx = use(AudioContext)
    if (!ctx) {
        throw new Error("useAudio must be used with an AudioContext")
    }
    return ctx
}
