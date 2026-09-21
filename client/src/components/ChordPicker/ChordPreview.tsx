import type {Chord} from "@fretboard/shared/types/chord";
import {useMemo} from "react";
import {indexForNoteName} from "@fretboard/shared/utils/indexForNoteName";
import {midiPitchToNoteName} from "@fretboard/shared/utils/midiPitchToNoteName";
import getScaleDegreeNumbers from "../../formulas/scaleShapes/getScaleDegreeNumbers.ts";
import {useChord} from "../../contexts/chord/useChord.ts";
import {chordIntervalsToScaleIntervals} from "@fretboard/shared/utils/chordIntervalsToScaleIntervals";
import {ScaleDot} from "../ScalePreview/ScaleDot.tsx";
import {styleNoteName} from "@fretboard/shared/utils/styleNoteName";

type Props = {
    chord: Chord,
    active: boolean,
}

export function ChordPreview({chord, active}: Props) {
    const chordContext = useChord()

    const chordAsScaleIntervals = useMemo(() => {
        return chordIntervalsToScaleIntervals(chord.intervals)
    }, [chord.intervals])

    const labels: string[] = useMemo(() => {
        const tonic = chordContext.chord.root
        const labels: string[] = [tonic]
        const tonicIdx = indexForNoteName(tonic)
        let intervalSum = 0
        for (let i = 0; i < chordAsScaleIntervals.length - 1; i++) {
            intervalSum += chordAsScaleIntervals[i]
            const intIndex = (tonicIdx + intervalSum) % 12
            const label = midiPitchToNoteName(
                intIndex,
                false,
                (() => {
                    if (chordContext.chord.root.includes("b")) return "flats"
                    return "sharps"
                })(),
                true
            )
            labels.push(label)
        }

        return labels
    }, [chordAsScaleIntervals, chordContext.chord.root])

    const degreeLabels: string[] = useMemo(() => {
        return getScaleDegreeNumbers(
            chordAsScaleIntervals,
            "interval"
        )
    }, [chordAsScaleIntervals])

    return (
        <button
            className={`
            ${!active ? `odd:bg-neutral-950 even:bg-black hover:bg-neutral-800` : `bg-slate-700`}
            p-2 flex flex-col 
            gap-2 items-start cursor-pointer
        `}
            onClick={(_) => {
                chordContext.setChord({
                    ...chord,
                    root: chordContext.chord.root
                })
            }}
        >
            <span className={`font-bold`}>{`${styleNoteName(chord.root)}${chord.quality}`}</span>
            <div className={`flex gap-1 items-center`}>
                {labels.map((_, i) => {
                    let text = ""
                    switch (chordContext.intervalPref) {
                        case "note":
                            text = labels[i]
                            break
                        case "interval":
                        default:
                            text = degreeLabels[i]
                            break
                    }
                    return (
                        <ScaleDot label={text} interval={degreeLabels[i]}/>
                    )
                })}
            </div>
        </button>
    )
}