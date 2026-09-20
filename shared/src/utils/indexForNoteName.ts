import type {NoteName} from "../types/scale";
import {
    TONES_SHARP,
    TONES_FLAT,
    TONES_SHARP_ENHARM,
    TONES_FLAT_ENHARM,
    TONES_FLAT_ENHARM_DOUBLE,
    TONES_SHARP_ENHARM_DOUBLE
} from "../consts";

export function indexForNoteName(noteName: NoteName): number {
    const sharpIndex = TONES_SHARP.indexOf(noteName)
    if (sharpIndex !== -1) return sharpIndex
    const flatIndex = TONES_FLAT.indexOf(noteName)
    if (flatIndex !== -1) return flatIndex
    const sharpEnharmIndex = TONES_SHARP_ENHARM.indexOf(noteName)
    if (sharpEnharmIndex !== -1) return sharpEnharmIndex
    const flatEnharmIndex = TONES_FLAT_ENHARM.indexOf(noteName)
    if (flatEnharmIndex !== -1) return flatEnharmIndex
    const doubleSharpEnharmIndex = TONES_SHARP_ENHARM_DOUBLE.indexOf(noteName)
    if (doubleSharpEnharmIndex !== -1) return doubleSharpEnharmIndex
    const doubleFlatEnharmIndex = TONES_FLAT_ENHARM_DOUBLE.indexOf(noteName)
    if (doubleFlatEnharmIndex !== -1) return doubleFlatEnharmIndex

    throw new Error(`"${noteName}" is not a valid note name`)
}
