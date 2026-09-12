import {indexForNoteName} from "./indexForNoteName";
import type {NoteName} from "../types/scale";

export function allIndicesForNoteName(noteName: NoteName): Set<number> {
    const indexes: Set<number> = new Set()
    const baseIndex = indexForNoteName(noteName)
    indexes.add(baseIndex)
    let lastIndex = baseIndex
    while (true) {
        const newIndex = lastIndex + 12
        if (newIndex > 127) break
        indexes.add(newIndex)
        lastIndex = newIndex
    }

    return indexes
}
