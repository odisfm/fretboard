import type {Scale, ScalePosition, ScaleShape} from "@fretboard/shared/types/scale";
import {useTuning} from "../../contexts/tuning/useTuning.ts";
import {useMemo} from "react";
import NoteDot, {type DotVisibility} from "./NoteDot.tsx";
import StringVisual from "./decorations/StringVisual.tsx";
import FretVisual from "./decorations/FretVisual.tsx";
import {useScale} from "../../contexts/scale/useScale.ts";
import {FretDotSide} from "./decorations/FretDotSide.tsx";
import {useFretboardDisplay} from "../../contexts/fretboardDisplay/useFretboardDisplay.tsx";

type Props = {
    fretNumber: number,
    scale: Scale,
    highlightedShape?: ScaleShape,
    zeroFret: boolean,
    orientation: "horizontal" | "vertical"
    ref?: React.Ref<HTMLDivElement>;
}

export default function Fret(
    {
        fretNumber,
        highlightedShape,
        zeroFret,
        orientation,
        ref,
    }: Props) {
    const fdContext = useFretboardDisplay()
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

    const {inScale, inDegree} = useMemo(() => {
        const inScale = Array(tuning.strings.length).fill(false)
        const inDegree = Array(tuning.strings.length).fill(false)
        for (let i = 0; i < tuning.strings.length; i++) {
            const zeroFret = tuning.strings[i];
            const pitch = zeroFret + fretNumber
            for (let j = 0; j < scaleContext.degreesToPitches.length; j++) {
                const degreeSet = scaleContext.degreesToPitches[j]
                if (degreeSet.has(pitch)) {
                    inScale[i] = pitch
                    inDegree[i] = j
                    break
                }
            }
        }
        return {inScale, inDegree}
    }, [scaleContext, fretNumber, tuning.strings])

    let unitLength = fdContext.variant === "main" ? 80 : 40; // px, along the orientation axis
    let unitWidth = fdContext.variant === "main" ? 40: 20;  // px, across strings
    if (orientation === "horizontal") {
        unitLength *= fdContext.zoom
        unitWidth *= (fdContext.zoom * .7)
    } else if (orientation === "vertical") {
        unitWidth *= fdContext.zoom
        unitLength *= (fdContext.zoom * .7)
    }

    let showFretNumber = false
    if (fdContext.variant === "main") {
        showFretNumber = true
    } else {
        if (highlightedShape && fretNumber === highlightedShape.lowFret) {
            showFretNumber = true
        }
    }

    let dotStyle: "single" | "double" | null
    if (fdContext.variant === "preview") {
        dotStyle = null
    } else if ([12, 24].includes(fretNumber)) {
        dotStyle = "double"
    } else if ([3, 5, 7, 9, 15, 17, 19, 21].includes(fretNumber)) {
        dotStyle = "single"
    } else {
        dotStyle = null
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
                    <span className={`${fdContext.variant === "main" ? "text-md" : "text-xs"}`}>
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
                    const degree = p ? p.scaleIndex : inDegree[stringIdx]
                    if (p) {
                        visibility = "highlight"
                    } else {
                        if (highlightedShape) {
                            if (zeroFret) {
                                visibility = "zeroFret"
                            } else if (inScale[stringIdx] !== false) {
                                visibility = "dim"
                            } else {
                                visibility = "none"
                            }
                        } else {
                            if (inScale[stringIdx] !== false) {
                                visibility = "highlight"
                            } else {
                                if (zeroFret) {
                                    visibility = "zeroFret"
                                } else {
                                    visibility = "none"
                                }
                            }
                        }
                    }
                    return (
                        <div
                            key={stringIdx}
                            className="relative flex items-center justify-center p-2"
                        >
                            {!zeroFret && <FretVisual orientation={orientation}/>}
                            {<StringVisual orientation={orientation}/>}
                            <NoteDot pitch={pitch} visibility={visibility} variant={fdContext.variant} degree={degree}/>
                        </div>
                    )
                })}
            </>

            <div>
                <FretDotSide style={dotStyle} orientation={orientation}/>
            </div>
        </div>
    )

}