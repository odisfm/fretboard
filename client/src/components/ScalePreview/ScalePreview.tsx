import type {Scale} from "@fretboard/shared/types/scale";
import {useMemo} from "react";
import {indexForNoteName} from "@fretboard/shared/utils/indexForNoteName";
import {midiPitchToNoteName} from "@fretboard/shared/utils/midiPitchToNoteName";
import {useScale} from "../../contexts/scale/useScale.ts";
import getScaleDegreeNumbers from "../../formulas/scaleShapes/getScaleDegreeNumbers.ts";
import {ScaleDot} from "./ScaleDot.tsx";

export function ScalePreview({scale, active}: {
    scale: Scale
    active: boolean
}) {
    const scaleContext = useScale()

    const labels: string[] = useMemo(() => {
        const tonic = scale.tonic
        const labels: string[] = [tonic]
        const tonicIdx = indexForNoteName(tonic)
        let intervalSum = 0
        for (let i = 0; i < scale.intervals.length - 1; i++) {
            intervalSum += scale.intervals[i]
            const intIndex = (tonicIdx + intervalSum) % 12
            const label = midiPitchToNoteName(
                intIndex,
                false,
                (() => {
                    if (scale.tonic.includes("b")) return "flats"
                    return "sharps"
                })(),
                true
            )
            labels.push(label)
        }

        return labels
    }, [scale])

    const degreeLabels: string[] = useMemo(() => {
        return getScaleDegreeNumbers(
            scale.intervals,
            scaleContext.intervalPref !== "note" ? scaleContext.intervalPref : "nashville"
        )
    }, [scale.intervals, scaleContext.intervalPref])

    const intervalLabels: string[] = useMemo(() => { // specifically to style the dots
        return getScaleDegreeNumbers(
            scale.intervals,
            "interval"
        )
    }, [scale.intervals])

    return (
        <button
            className={`
            ${!active ? `odd:bg-neutral-950 even:bg-black hover:bg-neutral-800` : `bg-slate-700`}
            p-2 flex flex-col 
            gap-2 items-start cursor-pointer
        `}
            onClick={(_) => {
                scaleContext.setScale(scale)
            }}
        >
            <span className={`font-bold`}>{`${scale.tonic} ${scale.name}`}</span>
            <div className={`flex gap-1 items-center`}>
                {labels.map((_, i) => {
                    let text = ""
                    switch (scaleContext.intervalPref) {
                        case "note":
                            text = labels[i]
                            break
                        case "interval":
                        case "nashville":
                            text = degreeLabels[i]
                            break
                    }
                    return (
                        <ScaleDot label={text} interval={intervalLabels[i]}/>
                    )
                })}
            </div>
        </button>
    )
}