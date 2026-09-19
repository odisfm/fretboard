import type {Scale, ScaleShape} from "../types/scale";
import type {Tuning} from "../types/tuning";

export function isSameScale(a: Scale, b: Scale, includeTonic: boolean): boolean {
    if (includeTonic) {
        if (a.tonic !== b.tonic) {
            return false
        }
    }
    if (a.intervals.length !== b.intervals.length) return false
    for (let i = 0; i < a.intervals.length; i++) {
        if (a.intervals[i] !== b.intervals[i]) {
            return false
        }
    }
    return true
}

export function isSameTuning(a: Tuning, b: Tuning, includeSuperset = false): boolean {
    /** includeSuperset checks if a has all the pitches of b contiguously **/
    if (!includeSuperset) {
        if (a.strings.length !== b.strings.length) return false
        for (let i = 0; i < a.strings.length; i++) {
            if (a.strings[i] !== b.strings[i]) return false
        }
        return true
    }

    const longer = a.strings
    const shorter = b.strings

    if (shorter.length === 0) return true
    if (shorter.length > longer.length) return false

    const maxStart = longer.length - shorter.length
    outer: for (let start = 0; start <= maxStart; start++) {
        for (let j = 0; j < shorter.length; j++) {
            if (longer[start + j] !== shorter[j]) continue outer
        }
        return true
    }
    return false
}

export function isSameScaleShape(a: ScaleShape, b: ScaleShape): boolean {
    if (!isSameScale(a.scale, b.scale, false))  return false
    if (!isSameTuning(a.tuning, b.tuning)) return false
    const aShape = a.shape
    const bShape = b.shape
    if (a.shape.length !== b.shape.length) return false
    for (let i = 0; i < aShape.length; i++) {
        if (aShape[i].stringIndex !== bShape[i].stringIndex) return false
        if (aShape[i].fret !== bShape[i].fret) return false
    }
    return true
}
