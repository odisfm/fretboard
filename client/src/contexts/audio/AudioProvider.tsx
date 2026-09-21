import {AudioContext} from "./AudioContext.tsx";
import * as Tone from "tone";

const synth = new Tone.PolySynth(Tone.Synth).toDestination();
let started = false

async function playNote(pitch: string, length?: string) {
    if (!started) {
        await Tone.start();
        started = true;
    }
    synth.triggerAttackRelease(pitch, length || "8n")
}

async function playNotes(pitches: string[], length?: string, space?: number, chord?: boolean) {
    if (!started) {
        await Tone.start();
        started = true;
    }
    if (!length) {
        length = "4n"
    }
    if (space) {
        const now = Tone.now();
        if (chord) {
            pitches.map((p, i) => {
                synth.triggerAttackRelease(p, space * (pitches.length - i), i === 0 ? now : now + (space * i))
            })
        } else {
            pitches.map((p, i) => {
                synth.triggerAttackRelease(p, space, now + (space * i))
            })
        }
    } else {
        synth.triggerAttackRelease(pitches, length)
    }
}

async function releaseAll() {
    if (!started) {
        await Tone.start();
        started = true;
    }
    synth.releaseAll()
}

export function AudioProvider({children}: {children: React.ReactNode}) {

    return (
        <AudioContext value={{playNote, playNotes, releaseAll}}>
            {children}
        </AudioContext>
    )
}
