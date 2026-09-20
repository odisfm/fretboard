import type {ChordPickerOptions} from "../../ChordDemo.tsx";
import {type Chord} from "@fretboard/shared/types/chord"

export function getChordPickerOptionsFromChord(chord: Chord): ChordPickerOptions {
    const intervals = chord.intervals
    let majorMinor: "major" | "minor" | false = false
    let perfectFifth = false

    return {
        quality: (() => {
            if (intervals.includes(4)) {
                majorMinor = "major"
                return "major"
            }
            if (intervals.includes(3)) {
                majorMinor = "minor"
                return "minor"
            }
            majorMinor = false
            return null
        })(),
        fifth: (() => {
            if (intervals.includes(7)) {
                perfectFifth = true
                return "perfect"
            }
            if (majorMinor !== "major" && intervals.includes(8)) return "sharp"
            if (majorMinor !== "minor" && intervals.includes(6)) return "flat"
            return null
        })(),
        seventh: (() => {
            if (intervals.includes(11)) return "major"
            if (intervals.includes(10)) return "dom"
            if (intervals.includes(9)) return "sixth"
            return null
        })(),
        ninth: (() => {
            if (intervals.includes(13)) return "flat"
            if (intervals.includes(14)) return "natural"
            if (intervals.includes(15)) return "sharp"
            return null
        })(),
        eleventh: (() => {
            if (intervals.includes(16)) return "flat"
            if (intervals.includes(17)) return "natural"
            if (intervals.includes(18)) return "sharp"
            return null
        })(),
        thirteenth: (() => {
            if (intervals.includes(20)) return "flat"
            if (intervals.includes(21)) return "natural"
            if (intervals.includes(22)) return "sharp"
            return null
        })(),
        add2: (() => {
            if (intervals.includes(2)) return "add2"
            if (intervals.includes(14)) return "add9"
            return null
        })(),
        add4: (() => {
            if (intervals.includes(5)) return "add4"
            if (intervals.includes(17)) return "add11"
            return null
        })(),
        add6: (() => {
            if (intervals.includes(9)) return "add6"
            if (intervals.includes(21)) return "add13"
            return null
        })(),
        augDim: (() => {
            if (majorMinor === "major" && !perfectFifth && intervals.includes(8)) return "aug"
            if (majorMinor === "minor" && !perfectFifth && intervals.includes(6)) return "dim"
            return null
        })(),
        sus: (() => {
            if (majorMinor) return null
            if (intervals.includes(2)) return "sus2"
            if (intervals.includes(4)) return "sus4"
            return null
        })(),
    }
}