import { TONES_SHARP, TONES_FLAT} from "../consts";
import type {NoteName} from "../types/scale";
const TONE_COUNT = TONES_SHARP.length // 12

export function midiPitchToNoteName(
    midiPitch: number,
    useOctave: boolean = true,
    accidentals: "sharps" | "flats" = "sharps"
): NoteName {
    if (!Number.isInteger(midiPitch)) {
        throw new Error("midiPitch must be integer")
    }
    if (midiPitch < 0 || midiPitch > 127) {
        throw new Error("midiPitch must be between 0-127 inclusive")
    }
    let tones;
    tones = accidentals === "sharps" ? TONES_SHARP : TONES_FLAT;
    const toneIdx = midiPitch % TONE_COUNT;
    const octave =  Math.floor(midiPitch / TONE_COUNT) - 1;

    let output = tones[toneIdx];

    if (useOctave) {
        output += octave;
    }

    return output as NoteName;
}
