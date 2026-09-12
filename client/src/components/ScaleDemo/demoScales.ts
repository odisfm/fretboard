import type {Scale} from "@fretboard/shared/src/types/scale.ts";

export const demoScales: Scale[] = [
    {
        name: "Major",
        intervals: [2, 2, 1, 2, 2, 2, 1],
        tonic: "C"
    },
    {
        name: "Minor",
        intervals: [2, 1, 2, 2, 1, 2, 2],
        tonic: "C"
    },
    {
        name: "Pentatonic Minor",
        intervals: [3, 2, 2, 3, 2],
        tonic: "C"
    },
]
