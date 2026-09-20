import type {Chord} from "../../types/chord";

type NewChord = Omit<Chord, "id" | "order">

export const defaultChords: NewChord[] = [
    {
        quality: "Major",
        root: "C",
        intervals: [4, 7]
    },
    {
        quality: "minor",
        root: "C",
        intervals: [3, 7]
    },
    {
        quality: "Maj7",
        root: "C",
        intervals: [4, 7, 11]
    },
    {
        quality: "min7",
        root: "C",
        intervals: [3, 7, 10]
    },
    {
        quality: "7",
        root: "C",
        intervals: [4, 7, 10]
    }
]
