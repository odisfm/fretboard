import type {Chord, ChordShape} from "@fretboard/shared/types/chord";
import {useMemo, useState} from "react";
import type {AccidentalPrefType} from "../scale/ScaleContext.ts";
import {ChordContext, type IntervalPrefType} from "./ChordContext.ts";
import {TONES, TONES_FLAT, TONES_SHARP} from "@fretboard/shared/consts";
import {indexForNoteName} from "@fretboard/shared/utils/indexForNoteName";
import type {NoteName} from "@fretboard/shared/types/scale";
import getScaleDegreeNumbers from "../../formulas/scaleShapes/getScaleDegreeNumbers.ts";
import {allIndicesForNoteName} from "@fretboard/shared/utils/allIndicesForNoteName";
import {midiPitchToNoteName} from "@fretboard/shared/utils/midiPitchToNoteName";
import {chordIntervalsToScaleIntervals} from "@fretboard/shared/utils/chordIntervalsToScaleIntervals";

export function ChordProvider({children, initialChord}: {children: React.ReactNode, initialChord: Chord}) {
    const [chord, setChord] = useState<Chord>(initialChord);
    const [chordShape, setChordShape] = useState<ChordShape | null>(null);
    const [accidentalPref, setAccidentalPref] = useState<AccidentalPrefType>(null);
    const [intervalPref, setIntervalPref] = useState<IntervalPrefType>("interval");

    const chordSpelling = useMemo(() => {
        if (chord.root.includes("b")) return "flats"
        return "sharps"
    }, [chord.root])

    function _setAccidentalPref(accidentalPref: AccidentalPrefType) {
        let tones: string[]
        switch (accidentalPref) {
            case "sharps":
                tones = TONES_SHARP
                break
            case "flats":
                tones = TONES_FLAT
                break
            case null:
                tones = TONES
        }
        const newTonic = tones[indexForNoteName(chord.root)]
        setChord({
            ...chord,
            root: newTonic as NoteName
        })
        setAccidentalPref(accidentalPref)
    }

    const toneNumbers = useMemo(() => {
        return getScaleDegreeNumbers(chordIntervalsToScaleIntervals(chord.intervals), "interval")
    }, [chord.intervals])

    const fretLabels = useMemo(() => {
        if (intervalPref === "finger") {
            if (!chordShape) return []
            return chordShape.shape.map((p) => {
                return String(p.finger) || "?"
            })
        } else if (intervalPref === "interval") {
            return getScaleDegreeNumbers(chordIntervalsToScaleIntervals(chord.intervals), "interval")
        } else {  // if (intervalPref === "note") {
            return chord.intervals.map((i) => {
                return midiPitchToNoteName(indexForNoteName(chord.root) + i, false)
            })
        }
    }, [chordShape, intervalPref, chord])

    const tonesToPitches: Set<number>[] = useMemo(() => {
        const arr: Set<number>[] = []
        const tonicSet = allIndicesForNoteName(chord.root)
        arr.push(tonicSet)
        const intervals = chordIntervalsToScaleIntervals(chord.intervals)
        let lastNoteName = chord.root
        for (let i = 0; i < intervals.length - 1; i++) {
            const degreeIndex = (indexForNoteName(lastNoteName) + intervals[i]) % 12;
            lastNoteName = midiPitchToNoteName(degreeIndex, false) as NoteName
            const degreeSet = allIndicesForNoteName(lastNoteName)
            arr.push(degreeSet)
        }

        return arr
    }, [chord])

    return (
        <ChordContext value={{
            chord,
            setChord,
            accidentalPref,
            setAccidentalPref: _setAccidentalPref,
            intervalPref,
            setIntervalPref,
            chordSpelling,
            toneNumbers,
            tonesToPitches,
            chordShape,
            setChordShape,
            fretLabels
        }}>
            {children}
        </ChordContext>
    )
}