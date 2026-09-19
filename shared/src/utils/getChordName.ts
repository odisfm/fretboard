import { detect } from "@tonaljs/chord-detect";
import type {NoteName} from "../types/scale";
import {indexForNoteName} from "./indexForNoteName";
import {midiPitchToNoteName} from "./midiPitchToNoteName";

export function getChordNames(
    root: NoteName,
    intervals: number[],
    shouldThrow?: false
): string[] {
    const noteNames: NoteName[] = [root];
    for (const i of intervals) {
        noteNames.push(midiPitchToNoteName((indexForNoteName(root) + i) % 12, false))
    }

    const detectedNames = detect(noteNames, {
        assumePerfectFifth: false
    });

    if (shouldThrow && !detectedNames.length) {
        throw new Error("No chord detected")
    }

    for (let i = 0; i < detectedNames.length; i++) {
        const detected = detectedNames[i];
        if (detected.endsWith("M")) {
            detectedNames[i] = `${detected.slice(0, -1)}`
        }
    }

    return detectedNames;
}

export function getChordName(
    root: NoteName,
    intervals: number[],
    shouldThrow?: false
): string | null {
    const detected = getChordNames(root, intervals, shouldThrow);
    if (detected?.length) {
        return detected[0]
    } else {
        return null
    }
}
