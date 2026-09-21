import type {Scale, ScalePosition} from "@fretboard/shared/types/scale";
import {useTuning} from "../../contexts/tuning/useTuning.ts";
import {useMemo} from "react";
import NoteDot, {type BarreType, type DotVisibility, type ZeroFretType} from "./NoteDot.tsx";
import StringVisual from "./decorations/StringVisual.tsx";
import FretVisual from "./decorations/FretVisual.tsx";
import {useScale} from "../../contexts/scale/useScale.ts";
import {FretDotSide} from "./decorations/FretDotSide.tsx";
import {useFretboardDisplay} from "../../contexts/fretboardDisplay/useFretboardDisplay.tsx";
import type {FingerPosition, FingerShape} from "@fretboard/shared/types/fingerShape";
import type {ChordPosition, Finger} from "@fretboard/shared/types/chord";
import {useChord} from "../../contexts/chord/useChord.ts";

type Props = {
    fretNumber: number,
    scale: Scale,
    shape?: FingerShape,
    zeroFret: boolean,
    orientation: "horizontal" | "vertical"
    ref?: React.Ref<HTMLDivElement>;
}

export default function Fret(
    {
        fretNumber,
        shape,
        zeroFret,
        orientation,
        ref,
    }: Props) {
    const fdContext = useFretboardDisplay()
    const scaleContext = useScale()
    const chordContext = useChord()
    const tuningContext = useTuning()
    const tuning = tuningContext.tuning
    const boardUnits = tuning.strings.length + 2 // 1 for fret #s, 1 for fret dots
    const isZeroFret = fretNumber === 0

    const inShape: (null | FingerPosition)[] = useMemo(() => {
        const arr = Array(tuning.strings.length).fill(null)
        if (!shape) return arr
        for (const pos of shape.shape) {
            if (pos.fret === fretNumber) {
                arr[pos.stringIndex] = pos
            }
        }
        return arr
    }, [tuning, shape, fretNumber])

    const {inScale, inDegree} = useMemo(() => {
        const inScale = Array(tuning.strings.length).fill(false)
        const inDegree = Array(tuning.strings.length).fill(false)
        if (shape?.chord) {
            for (let i = 0; i < tuning.strings.length; i++) {
                const zeroFret = tuning.strings[i];
                const pitch = zeroFret + fretNumber
                for (let j = 0; j < chordContext.tonesToPitches.length; j++) {
                    const toneSet = chordContext.tonesToPitches[j]
                    if (toneSet.has(pitch)) {
                        inScale[i] = pitch
                        inDegree[i] = j
                        break
                    }
                }
                }
        } else {
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
        }
        return {inScale, inDegree}
    }, [scaleContext, chordContext, fretNumber, tuning.strings, shape])

    let unitLength = fdContext.variant === "main" ? 80 : 40; // px, along the orientation axis
    let unitWidth = fdContext.variant === "main" ? 40: 20;  // px, across strings
    if (orientation === "horizontal") {
        unitLength *= fdContext.zoom
        unitWidth *= (fdContext.zoom * .7)
    } else if (orientation === "vertical") {
        unitWidth *= fdContext.zoom
        unitLength *= (fdContext.zoom * .7)
    }
    if (isZeroFret && fdContext.type === "chord") {
        unitLength *= .7
    }

    let showFretNumber = false
    if (fdContext.variant === "main") {
        showFretNumber = true
    } else {
        if (fdContext.type === "scale") {
            if (shape && fretNumber === shape.lowFret) {
                showFretNumber = true
            }
        } else {
            if (isZeroFret) {
                showFretNumber = true
            } else {
                showFretNumber = true
                for (const p of shape!.shape) {
                    if (p.fret && p.fret < fretNumber) {
                        showFretNumber = false
                        break
                    }
                }
            }
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
        className={`grid border-neutral-300 isolate 
              ${fdContext.variant === "main" && `
                ${isZeroFret && orientation === "horizontal" && `border-r-4`}
                ${isZeroFret && orientation === "vertical" && `border-b-4`}
              `}
              ${fdContext.variant === "preview" && `
                ${isZeroFret && orientation === "horizontal" && `border-r-2 border-neutral-500`}
              `}
        `}
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
                    let degree: number | false
                    let zeroFretType: ZeroFretType = null
                    if (fdContext.type === "scale") {
                        degree = p ? (shape?.scale && (p as ScalePosition).scaleIndex) : inDegree[stringIdx]
                        if (isZeroFret) {
                            if (p) {
                                zeroFretType = "inKey"
                            } else {
                                if (degree) {
                                    zeroFretType = "inKey"
                                } else {
                                    zeroFretType = "outKey"
                                }
                            }
                        }
                    } else if (fdContext.type === "chord") {
                        if (p) {
                            degree = (p as ChordPosition).toneIndex
                            visibility = isZeroFret ? "zeroFret" : "highlight"
                            zeroFretType = isZeroFret ? "open" : null
                        } else {
                            if (inScale[stringIdx] !== false) {
                                if (isZeroFret) {
                                    if (shape) {
                                        zeroFretType = "dead"
                                        for (const pos of shape.shape) {
                                            if (pos.stringIndex === stringIdx) {
                                                zeroFretType = "irrelevant"
                                            }
                                        }
                                    } else {
                                        zeroFretType = "inKey"
                                    }
                                }
                                visibility = "dim"
                                for (let i = 0; i < chordContext.tonesToPitches.length; i++) {
                                    if (chordContext.tonesToPitches[i].has(pitch)) {
                                        degree = i
                                    }
                                }
                            } else {
                                visibility = "none"
                                degree = false
                                if (isZeroFret) {
                                    zeroFretType = "dead"
                                    if (shape?.shape) {
                                        for (const pos of shape!.shape) {
                                            if (pos.stringIndex === stringIdx) {
                                                zeroFretType = "irrelevant"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    const highlight = (() => {
                        if (p) return true
                        if (!shape?.chord) return false
                        for (const pos of shape.shape) {
                            if (i === pos.stringIndex && tuning.strings[i] + pos.fret === pitch) {
                                return true
                            }
                        }
                        return false
                    })()

                    if (!shape?.chord) {
                        if (highlight) {
                            visibility = "highlight"
                        } else {
                            if (shape) {
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
                    }

                    let barre: BarreType = null
                    let finger: Finger | undefined = undefined
                    if (shape?.barres) {
                        for (const b of shape.barres) {
                            if (b.fret === fretNumber) {
                                if (stringIdx === b.fromString) {
                                    barre = "top"
                                } else if (stringIdx === b.toString) {
                                    barre = "bottom"
                                } else if (stringIdx > b.fromString && stringIdx < b.toString) {
                                    barre = "middle"
                                }
                                if (barre) break
                            }
                        }
                    }
                    if (shape?.chord) {
                        for (const p of shape.shape) {
                            if (p.stringIndex === stringIdx && p.fret === fretNumber) {
                                if (p?.finger) {
                                    finger = p.finger
                                }
                                break
                            }
                        }
                    }

                    return (
                        <div
                            key={stringIdx}
                            className="relative flex justify-center items-center"
                        >
                            {!zeroFret && <FretVisual orientation={orientation}/>}
                            {<StringVisual orientation={orientation}/>}
                            <NoteDot
                                pitch={pitch}
                                visibility={visibility!}
                                variant={fdContext.variant}
                                degree={degree!}
                                barre={barre}
                                finger={finger}
                                zeroFretType={zeroFretType}
                                stringIndex={stringIdx}
                                fretNumber={fretNumber}
                            />
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