import {type Scale} from "../../types/scale"

type NewScale = Omit<Scale, "id">

export const defaultScales: NewScale[] = [
    {
        name: "Major",
        intervals: [2, 2, 1, 2, 2, 2, 1],
        tonic: "C"
    },
    {
        name: "Minor",
        intervals: [2, 1, 2, 2, 2, 1, 2],
        tonic: "C"
    },
    {
        name: "Harmonic Minor",
        intervals: [2, 1, 2, 2, 1, 3, 1],
        tonic: "C"
    },
    {
        name: "Dorian",
        intervals: [2, 1, 2, 2, 2, 1, 2],
        tonic: "C"
    },
    {
        name: "Phrygian",
        intervals: [1, 2, 2, 2, 1, 2, 2],
        tonic: "C"
    },
    {
        name: "Lydian",
        intervals: [2, 2, 2, 1, 2, 2, 1],
        tonic: "C"
    },
    {
        name: "Mixolydian",
        intervals: [2, 2, 1, 2, 2, 1, 2],
        tonic: "C"
    },
    {
        name: "Locrian",
        intervals: [1, 2, 2, 1, 2, 2, 2],
        tonic: "C"
    },
    {
        name: "Minor Pentatonic",
        intervals: [3, 2, 2, 3, 2],
        tonic: "C"
    },
    {
        name: "Major Pentatonic",
        intervals: [2, 2, 3, 2, 3],
        tonic: "C"
    },
    {
        name: "Major Blues",
        intervals: [2, 1, 1, 3, 2, 3],
        tonic: "C"
    },
    {
        name: "Minor Blues",
        intervals: [3, 2, 1, 1, 3, 2],
        tonic: "C"
    },
    {
        name: "Augmented",
        intervals: [3, 1, 3, 1, 3, 1],
        tonic: "C"
    },
    {
        name: "Diminished",
        intervals: [2, 1, 2, 1, 2, 1, 2, 1],
        tonic: "C"
    }
]