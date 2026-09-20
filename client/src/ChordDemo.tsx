import {FretboardDisplayContext} from "./contexts/fretboardDisplay/FretboardDisplayContext.ts";
import Fretboard from "./components/Fretboard/Fretboard.tsx";
import {useTuning} from "./contexts/tuning/useTuning.ts";
import {useEffect, useMemo, useState} from "react";
import Button from "./components/generic/Button.tsx";
import ShapePicker from "./components/ShapePicker/ShapePicker.tsx";
import {generateChordShapes} from "./formulas/chordShapes/generateChordShapes.tsx";
import {useChord} from "./contexts/chord/useChord.ts";
import {chordIntervalsToScaleIntervals} from "@fretboard/shared/utils/chordIntervalsToScaleIntervals"
import {ChordPicker} from "./components/ChordPicker/ChordPicker.tsx";
import {getChordIntervalsFromOptions} from "./formulas/chordShapes/getChordIntervalsFromOptions.ts";
import type {ChordShape} from "@fretboard/shared/types/chord";
import {useUserData} from "./contexts/userData/useUserData.tsx";
import {isSameChord, isSameChordShape, isSameTuning} from "@fretboard/shared/utils/isSameStructure";

function dedupeShapes(shapes: ChordShape[]): ChordShape[] {
    const result: ChordShape[] = []
    for (const shape of shapes) {
        const idx = result.findIndex(existing => isSameChordShape(shape, existing))
        if (idx === -1) {
            result.push(shape)
        } else if (result[idx].isAdjusted && !shape.isAdjusted) {
            result[idx] = shape
        }
    }
    return result
}

export type ChordPickerOptions = {
    quality: "major" | "minor" | null,
    sus: "sus2" | "sus4" | null,
    augDim: "aug" | "dim" | null,
    fifth: "flat" | "perfect" | "sharp" | null,
    seventh: "major" | "dom" | "sixth" | null,
    ninth: "flat" | "natural" | "sharp" | null,
    eleventh: "flat" | "natural" | "sharp" | null,
    thirteenth: "flat" | "natural" | "sharp" | null,
    add2: "add2" | "add9" | null,
    add4: "add4" | "add11" | null,
    add6: "add6" | "add13" | null
}

export function ChordDemo() {
    const tuningContext = useTuning()
    const userData = useUserData()
    const tuning = tuningContext.tuning
    const [activeShapeIdx, setActiveShapeIdx] = useState<number | null>(0);
    const chordContext = useChord()
    const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
    const [scrollToFret, setScrollToFret] = useState<null | number>(null);
    const [fretboardZoom, setFretboardZoom] = useState<number>(1.5)
    const [outShapeOpacity, setOutShapeOpacity] = useState<number>(.2)
    const [chordPickerOptions, setChordPickerOptions] = useState<ChordPickerOptions>({
        quality: "major", sus: null, augDim: null, fifth: "perfect", seventh: null,
        ninth: null, eleventh: null, thirteenth: null, add2: null, add4: null, add6: null
    })
    const [fitSavedShapes, setFitSavedShapes] = useState(false)
    console.log({setFretboardZoom, setOutShapeOpacity,
        fitSavedShapes, setFitSavedShapes}) // it's a surprise tool that will help us later

    function _setChordPickerOptions(chordPickerOptions: ChordPickerOptions) {
        const intervals = getChordIntervalsFromOptions(chordPickerOptions)
        chordContext.setChord({
            ...chordContext.chord,
            intervals: intervals,
        })
        setChordPickerOptions(chordPickerOptions)
    }


    const generatedShapes = useMemo(() => {
        return generateChordShapes(
            chordContext.chord,
            tuning,
            {
                fretSpan: 3,
                openStrings: false,
                omissions: [],
                barres: true,
                rootIsBass: true,
                fingers: 4,
                lowFret: 0,
                highFret: 24
            }
        )
    }, [tuning, chordContext.chord])

    const relevantSavedShapes: ChordShape[] = useMemo(() => {
        const relevant: ChordShape[] = []
        for (const s of userData.chordShapes) {
            // todo: fit saved shapes
            if (isSameChord(s.chord, chordContext.chord)) {
                if (isSameTuning(s.tuning, tuning)) {
                    relevant.push(s)
                }
            }
        }

        return relevant
    }, [userData.chordShapes, tuning, chordContext.chord])

    const chordShapes: ChordShape[] = useMemo(() => {
        const dedupedSaved = dedupeShapes(relevantSavedShapes)
        const shapes: ChordShape[] = [...dedupedSaved]
        for (const gs of generatedShapes) {
            if (!dedupedSaved.some(rs => isSameChordShape(gs, rs))) {
                shapes.push(gs)
            }
        }
        return shapes

        }, [relevantSavedShapes, generatedShapes])

    useEffect(() => {
        (async () => {
        if (activeShapeIdx === null || !generatedShapes) return
        const replacingShape = generatedShapes.at(activeShapeIdx)
        if (!replacingShape) return
        let lowFret = Infinity
        for (const p of replacingShape.shape) {
            if (p.fret && p.fret < lowFret) lowFret = p.fret
        }
        setScrollToFret(lowFret > 3 ? lowFret : 0)
        })()
    }, [generatedShapes, activeShapeIdx])

    function _setActiveShapeIdx(shapeIdx: number | null) {
        if (shapeIdx === null) {
            setActiveShapeIdx(shapeIdx)
            chordContext.setChordShape(null)
        } else {
            setActiveShapeIdx(shapeIdx)
            chordContext.setChordShape(chordShapes[shapeIdx])
        }
    }

    return (
        <>
            <ChordPicker chordPickerOptions={chordPickerOptions} setChordPickerOptions={_setChordPickerOptions} />

            <FretboardDisplayContext
                value={{zoom: fretboardZoom, variant: "main", outShapeOpacity, type: "chord"}}
            >
                <Fretboard
                    orientation={orientation}
                    startFret={1}
                    endFret={24}
                    scale={{
                        tonic: chordContext.chord.root,
                        intervals: chordIntervalsToScaleIntervals(chordContext.chord.intervals),
                        id: chordContext.chord.id,
                        name: chordContext.chord.quality,
                        order: ""
                    }}
                    renderZeroFret={true}
                    highlightedShape={chordContext.chordShape || undefined}
                    scrollToFret={scrollToFret}
                />
            </FretboardDisplayContext>

            <Button
                onClick={() => setOrientation(orientation === "horizontal" ? "vertical" : "horizontal")}
                styles={`px-4 py-2 text-lg self-start`}
                variant={"subtle"}
            >
            </Button>
            <FretboardDisplayContext value={{zoom: 1, variant: "preview", outShapeOpacity: 0, type: "chord"}}>
                <ShapePicker
                    onClick={(idx) => {_setActiveShapeIdx(idx)}}
                    active={activeShapeIdx}
                    fingerShapes={chordShapes}
                    setScrollToFret={setScrollToFret}
                    type={"chord"}
                />
            </FretboardDisplayContext>
        </>
    )
}