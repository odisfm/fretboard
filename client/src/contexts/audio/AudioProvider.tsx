import {AudioContext} from "./AudioContext.tsx";
import * as Tone from "tone";

const synth = new Tone.Synth().toDestination();
let started = false

async function playNote(pitch: string, length?: string) {
    if (!started) {
        await Tone.start();
        started = true;
    }
    synth.triggerAttackRelease(pitch, length || "8n")
}

export function AudioProvider({children}: {children: React.ReactNode}) {

    return (
        <AudioContext value={{playNote}}>
            {children}
        </AudioContext>
    )
}
