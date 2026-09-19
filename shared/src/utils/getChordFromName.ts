import { Chord as TonalChord } from "tonal";
import type {Chord} from "../types/chord";
import {v4 as createUuid} from "uuid";
import type {NoteName} from "../types/scale";
import {indexForNoteName} from "./indexForNoteName";

export function getChordFromName(name: string): Chord | null {
    const tonalResult = TonalChord.get(name)
    if (tonalResult.empty) return null
    const rootName = tonalResult.notes.shift()!
    const rootIndex = indexForNoteName(rootName as NoteName)
    const numberIntervals = []
    const toneNames = tonalResult.notes
    const intervalsToCheck = tonalResult.intervals.slice(1)!
    const compoundStartsAt: number | null = (() => {
       for (let i = 0; i < intervalsToCheck.length; i++) {
           const name = intervalsToCheck[i];
           if (/9|10|11|12|13|14|15/.test(name)) return i;
       }
       return null
    })()

    for (let i = 0; i < toneNames.length; i++) {
        const interval = toneNames[i];
        const intIndex = indexForNoteName(interval as NoteName)
        let jump = intIndex - rootIndex
        if (jump < 0) jump += 12
        if (compoundStartsAt !== null && i >= compoundStartsAt) {
            jump += 12
        }
        numberIntervals.push(jump)
    }

    return {
        id: createUuid(),
        quality: tonalResult.symbol,
        intervals: numberIntervals,
        root: tonalResult.tonic as NoteName
    }
}
