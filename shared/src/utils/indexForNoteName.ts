import type {NoteName} from "../types/scale";
import {TONES_SHARP, TONES_FLAT} from "../consts";

export function indexForNoteName(noteName: NoteName): number {
    const sharpIndex = TONES_SHARP.indexOf(noteName)
    if (sharpIndex !== -1) return sharpIndex
    const flatIndex = TONES_FLAT.indexOf(noteName)
    if (flatIndex !== -1) return flatIndex

    throw new Error(`"${noteName}" is not a valid note name`)
}
