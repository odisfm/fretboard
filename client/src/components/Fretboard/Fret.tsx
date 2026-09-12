import type {Scale, ScalePosition, ScaleShape} from "@fretboard/shared/src/types/scale.ts";
import {useTuning} from "../../contexts/tuning/useTuning.ts";
import {useMemo} from "react";
import NoteDot, {type DotVisibility} from "./NoteDot.tsx";

type Props = {
    fretNumber: number,
    scale: Scale,
    highlightedShape?: ScaleShape,
    zoom: number,
    zeroFret: boolean,
    orientation: "horizontal" | "vertical"
}

export default function Fret(
    {
        fretNumber,
        highlightedShape,
        zeroFret,
        orientation,
    }: Props) {
    const tuningContext = useTuning()
    const tuning = tuningContext.tuning
    const boardUnits = tuning.strings.length + 2 // 1 for fret #s, 1 for fret dots

    const inShape: (null | ScalePosition)[] = useMemo(() => {
        const arr = Array(tuning.strings.length).fill(null)
        if (!highlightedShape) return arr
        for (const pos of highlightedShape.shape) {
            if (pos.fret === fretNumber) {
                arr[pos.stringIndex] = pos
            }
        }
        return arr
    }, [tuning, highlightedShape, fretNumber])

    return (
        <div
            className={`grid min-w-15`}
            style={{
                gridTemplateRows: `repeat(${orientation === "horizontal" ? boardUnits : 1}, 1fr)`,
                gridTemplateColumns: `repeat(${orientation === "vertical" ? boardUnits : 1}, 1fr)`,
            }}
        >
            <div><span>{fretNumber}</span></div>
            {inShape.map((_, i) => {
                let stringIdx: number
                if (orientation === "horizontal") {
                    stringIdx = tuning.strings.length - 1 - i
                } else {
                    stringIdx = i
                }
                const p = inShape[stringIdx]
                const pitch = tuning.strings[stringIdx] + fretNumber
                let visibility: DotVisibility
                if (zeroFret) {
                    visibility = "zeroFret"
                } else {
                    visibility = p ? "highlight" : "none"
                }
                return (
                    <NoteDot pitch={pitch} visibility={visibility}/>
                )
            })}
            <div><span></span></div>
        </div>
    )

}