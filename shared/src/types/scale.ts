import type {Tuning} from "./tuning.js";

export type NoteName =
    "C" | "C#" | "Db" | "D" | "D#" | "Eb" | "E" | "F" | "F#" | "Gb" |
    "G" | "G#" | "Ab" | "A" | "A#" | "Bb" | "B"

export type Scale = {
    tonic: NoteName,
    /** Difference between a degree and the previous degree,
     * starting from the second degree and ending with the return to the tonic */
    intervals: number[],
    name: string
}

export type ScalePosition = {
    stringIndex: number,
    fret: number,
    /** Position in the scale, from 0-(n-1), where n is number of tones in scale.
     * Not a scale degree like b7. */
    scaleIndex: number
}

export type ScaleShape = {
    id?: string,
    scale: Scale,
    shape: ScalePosition[],
    tuning: Tuning,
    lowFret: number,
    highFret: number,
}
