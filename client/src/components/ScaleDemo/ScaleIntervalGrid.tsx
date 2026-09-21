import type {Scale} from "@fretboard/shared/types/scale";
import {useMemo} from "react";
import {indexForNoteName} from "@fretboard/shared/utils/indexForNoteName";
import {midiPitchToNoteName} from "@fretboard/shared/utils/midiPitchToNoteName";
import getScaleDegreeNumbers from "../../formulas/scaleShapes/getScaleDegreeNumbers.ts";
import {useScale} from "../../contexts/scale/useScale.ts";
import {ScaleDot} from "../ScalePreview/ScaleDot.tsx";

const dotStyles = `transition-colors transition-opacity`

export function ScaleIntervalGrid({scale}: {scale: Scale}) {
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
                scaleContext.accidentalPref || (() => {
                    if (scale.tonic.includes("b")) return "flats"
                    return "sharps"
                })(),
                true
            )
            labels.push(label)
        }

        return labels
    }, [scale, scaleContext.accidentalPref])

    const nashvilleLabels: string[] = useMemo(() => {
        return getScaleDegreeNumbers(
            scale.intervals,
            "nashville"
        )
    }, [scale.intervals])

    const intervalLabels: string[] = useMemo(() => { // specifically to style the dots
        return getScaleDegreeNumbers(
            scale.intervals,
            "interval"
        )
    }, [scale.intervals])

    return (
        <div
            className={`grid grid-rows-3 max-w-2/5 gap-1`}
            style={{
                gridTemplateColumns: `repeat(${nashvilleLabels.length}, 1fr)`,
            }}
        >
            {nashvilleLabels.map((label, i) => {
                return (
                    <ScaleDot
                        styles={dotStyles}
                        label={label}
                        interval={scaleContext.intervalPref === "nashville" ? intervalLabels[i] : ""
                        }
                        opacity={scaleContext.intervalPref === "nashville" ? 100 : 50}
                    />

                )})}
            {labels.map((label, i) => {
                return (
                    <ScaleDot
                        styles={dotStyles}
                        label={label}
                        interval={scaleContext.intervalPref === "note" ? intervalLabels[i] : ""
                            }
                        opacity={scaleContext.intervalPref === "note" ? 100 : 50}
                    />

                )})}
            {intervalLabels.map((label, i) => {
                return (
                    <ScaleDot
                        styles={dotStyles}
                        label={label}
                        interval={scaleContext.intervalPref === "interval" ? intervalLabels[i] : ""}
                        opacity={scaleContext.intervalPref === "interval" ? 100 : 50}
                    />

                )})}
        </div>
    )
}