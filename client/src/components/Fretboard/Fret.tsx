import type {Scale, ScalePosition, ScaleShape} from "@fretboard/shared/src/types/scale.ts";
import {useTuning} from "../../contexts/tuning/useTuning.ts";
import {useMemo} from "react";
import NoteDot, {type DotVisibility} from "./NoteDot.tsx";
import StringVisual from "./StringVisual.tsx";
import FretVisual from "./FretVisual.tsx";
import type {FretboardVariant} from "./Fretboard.tsx";
import {useScale} from "../../contexts/scale/useScale.ts";

type Props = {
    fretNumber: number,
    scale: Scale,
    highlightedShape?: ScaleShape,
    zoom: number,
    zeroFret: boolean,
    orientation: "horizontal" | "vertical"
    variant: FretboardVariant,
    ref?: React.Ref<HTMLDivElement>;
}

export default function Fret(
    {
        fretNumber,
        highlightedShape,
        zeroFret,
        orientation,
        variant,
        ref
    }: Props) {
    const scaleContext = useScale()
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

    const inScale: (false | number)[] = useMemo(() => {
        const arr = Array(tuning.strings.length).fill(false)
        for (let i = 0; i < tuning.strings.length; i++) {
            const zeroFret = tuning.strings[i];
            const pitch = zeroFret + fretNumber
            for (let j = 0; j < scaleContext.degreesToPitches.length; j++) {
                const degreeSet = scaleContext.degreesToPitches[j]
                if (degreeSet.has(pitch)) {
                    arr[i] = pitch
                    break
                }
            }
        }
        return arr
    }, [scaleContext, fretNumber, tuning.strings])

    const unitLength = variant === "main" ? 80 : 40; // px, along the orientation axis
    const unitWidth = variant === "main" ? 40: 20;  // px, across strings

    let showFretNumber = false
    if (variant === "main") {
        showFretNumber = true
    } else {
        if (highlightedShape && fretNumber === highlightedShape.lowFret) {
            showFretNumber = true
        }
    }

    return (
    <div
        className="grid"
        ref={ref}
        style={{
            "--unit-length": `${unitLength}px`,
            "--unit-width": `${unitWidth}px`,
            gridTemplateRows: orientation === "horizontal"
                ? `repeat(${boardUnits}, var(--unit-width))`
                : `var(--unit-length)`,
            gridTemplateColumns: orientation === "horizontal"
                ? `var(--unit-length)`
                : `repeat(${boardUnits}, var(--unit-width))`,
        } as React.CSSProperties}
    >
            <div className={`w-full h-full flex ${orientation === "horizontal" && "flex-col"} items-center`}>
                {showFretNumber &&
                    <span className={`${variant === "main" ? "text-md" : "text-xs"}`}>
                        {fretNumber}
                    </span>}
            </div>

            <>
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
                    if (p) {
                        visibility = "highlight"
                    } else {
                        if (zeroFret) {
                            visibility = "zeroFret"
                        } else if (inScale[stringIdx] !== false) {
                            visibility = "dim"
                        } else {
                            visibility = "none"
                        }
                    }
                    return (
                        <div
                            key={stringIdx}
                            className="relative flex items-center justify-center p-2"
                        >
                            {!zeroFret && <FretVisual orientation={orientation}/>}
                            {<StringVisual orientation={orientation}/>}
                            <NoteDot pitch={pitch} visibility={visibility} variant={variant}/>
                        </div>
                    )
                })}
            </>

            <div><span></span></div>
        </div>
    )

}