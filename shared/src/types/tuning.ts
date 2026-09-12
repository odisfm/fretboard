export type Tuning = {
    id?: string;
    name?: string;
    /** MIDI note numbers top-to-bottom / low-to-high pitch */
    strings: number[],
    /** Supports partial capo. `0` for un-capoed strings, all `0`s for no capo */
    capo: number[],
    fretCount: number,
    /** e.g. `guitar`, `bass` `ukulele`. To allow user sorting */
    instrument?: string,
}

export const eStandardTuning = {
    name: "Standard",
    strings: [40, 45, 50, 55, 59, 64],
    capo: [0, 0, 0, 0, 0, 0],
    fretCount: 24,
}
