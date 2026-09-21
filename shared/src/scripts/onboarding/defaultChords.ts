import type {Chord} from "../../types/chord";

type NewChord = Omit<Chord, "id" | "order">

export const defaultChords: NewChord[] = [
    {
        quality: "",
        root: "C",
        intervals: [4, 7]
    },
    {
        quality: "min",
        root: "C",
        intervals: [3, 7]
    },
    {
        quality: "maj7",
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
