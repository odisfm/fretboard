import {FretboardDisplayContext} from "./contexts/fretboardDisplay/FretboardDisplayContext.ts";
import Fretboard from "./components/Fretboard/Fretboard.tsx";
import {useTuning} from "./contexts/tuning/useTuning.ts";
import {useEffect, useMemo, useState} from "react";
import Button from "./components/generic/Button.tsx";
import ShapePicker from "./components/ShapePicker/ShapePicker.tsx";
import {
    defaultGenerateChordShapeOptions,
    type GenerateChordShapeOptions,
    generateChordShapes
} from "./formulas/chordShapes/generateChordShapes.tsx";
import {useChord} from "./contexts/chord/useChord.ts";
import {chordIntervalsToScaleIntervals} from "@fretboard/shared/utils/chordIntervalsToScaleIntervals"
import {ChordPicker} from "./components/ChordPicker/ChordPicker.tsx";
import {getChordIntervalsFromOptions} from "./formulas/chordShapes/getChordIntervalsFromOptions.ts";
import type {ChordShape} from "@fretboard/shared/types/chord";
import {useUserData} from "./contexts/userData/useUserData.tsx";
import {isSameChord, isSameChordShape, isSameTuning} from "@fretboard/shared/utils/isSameStructure";
import {ChordFilters} from "./components/ChordFilters/ChordFilters.tsx";
import {v4 as createUuid} from "uuid";
import {ShapePickerContainer} from "./components/containers/ShapePickerContainer.tsx";
import {ButtonGroup} from "./components/generic/ButtonGroup.tsx";
import {BinaryToggle} from "./components/generic/BinaryToggle.tsx";
import {styleNoteName} from "@fretboard/shared/utils/styleNoteName";
import {fitChordShapeToNewTonic} from "./formulas/chordShapes/fitChordToNewTonic.ts";

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
    const [chordPickerOptions, setChordPickerOptions] = useState<ChordPickerOptions>({
        quality: "major", sus: null, augDim: null, fifth: "perfect", seventh: null,
        ninth: null, eleventh: null, thirteenth: null, add2: null, add4: null, add6: null
    })
    const [fitSavedShapes, setFitSavedShapes] = useState(true)
    const [filterSavedShapes, setFilterSavedShapes] = useState(false)
    const [chordShapeFilters, setChordShapeFilters] = useState<GenerateChordShapeOptions>(
        defaultGenerateChordShapeOptions
    )
    const [onlyShapesOnRoot, setOnlyShapesOnRoot] = useState(false)
    const [shapeMode, setShapeMode] = useState<"finder" | "saved">("finder")
    console.log({fitSavedShapes, setFitSavedShapes}) // it's a surprise tool that will help us later

    function _setChordPickerOptions(chordPickerOptions: ChordPickerOptions) {
        const intervals = getChordIntervalsFromOptions(chordPickerOptions)
        chordContext.setChord({
            ...chordContext.chord,
            intervals: intervals,
            id: createUuid()
        })
        setChordPickerOptions(chordPickerOptions)
    }


    const generatedShapes = useMemo(() => {
        return generateChordShapes(
            chordContext.chord,
            tuning,
            chordShapeFilters
        )
    }, [tuning, chordContext.chord, chordShapeFilters])

    const relevantSavedShapes: ChordShape[] = useMemo(() => {
        const relevant: ChordShape[] = []
        for (const s of userData.chordShapes) {
            if (shapeMode === "finder") {
                if (isSameChord(s.chord, chordContext.chord)) {
                    if (isSameTuning(s.tuning, tuning)) {
                        if (s.chord.root === chordContext.chord.root) {
                            relevant.push(s)
                        } else if (fitSavedShapes) {
                            const result = fitChordShapeToNewTonic(s, chordContext.chord.root)
                            if (result) relevant.push(result)
                        }
                    }
                } else {
                    relevant.push(s)
                }
            } else if (shapeMode === "saved") {
                if (onlyShapesOnRoot) {
                    if (isSameChord(s.chord, chordContext.chord)) {
                        if (isSameTuning(s.tuning, tuning)) {
                            if (s.chord.root === chordContext.chord.root) {
                                relevant.push(s)
                            } else if (fitSavedShapes) {
                                const result = fitChordShapeToNewTonic(s, chordContext.chord.root)
                                if (result) relevant.push(result)
                            }
                        }
                    }
                } else {
                    relevant.push(s)
                }
            }
        }

        return relevant
    }, [userData.chordShapes, tuning, chordContext.chord, fitSavedShapes, onlyShapesOnRoot, shapeMode])

    const chordShapes: ChordShape[] = useMemo(() => {
        const dedupedSaved = dedupeShapes(relevantSavedShapes)
        let shapes: ChordShape[] = [...dedupedSaved]
        if (filterSavedShapes) {
            shapes = shapes.filter((shape) => {
                if (!chordShapeFilters.barres && shape.barres.length) return false
                if (chordShapeFilters.openStrings) {
                    for (const p of shape.shape) {
                        if (p.fret === 0) return false
                    }
                }
                if (chordShapeFilters.lowFret && shape.lowFret < chordShapeFilters.lowFret) return false
                if (chordShapeFilters.highFret && shape.highFret > chordShapeFilters.highFret) return false
                if (chordShapeFilters.fingers) {
                    for (const p of shape.shape) {
                        if (p.finger && p.finger > chordShapeFilters.fingers) return false
                    }
                }

                return true
            })
        }
        if (shapeMode === "finder") {
            for (const gs of generatedShapes) {
                if (!dedupedSaved.some(rs => isSameChordShape(gs, rs))) {
                    shapes.push(gs)
                }
            }
        }

        return shapes

        }, [relevantSavedShapes, generatedShapes, shapeMode, filterSavedShapes, chordShapeFilters])

    useEffect(() => {
        (async () => {
        if (activeShapeIdx === null || !generatedShapes) return
        const replacingShape = generatedShapes.at(activeShapeIdx)
        if (!replacingShape) return
        let lowFret = Infinity
        for (const p of replacingShape.shape) {
            if (p.fret && p.fret < lowFret) lowFret = p.fret
        }
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

    const showLabels = useMemo(() => {
        if (shapeMode === "finder") return false
        if (onlyShapesOnRoot) return false
        return true
    }, [shapeMode, onlyShapesOnRoot])

    return (
        <>
            <ChordPicker chordPickerOptions={chordPickerOptions} setChordPickerOptions={_setChordPickerOptions} />

            <FretboardDisplayContext
                value={{
                    zoom: userData.prefs.fretboardZoom,
                    variant: "main",
                    outShapeOpacity: userData.prefs.chordOutOpacity,
                    type: "chord",
                    orientation: userData.prefs.fretboardRotation
            }}
            >
                <Fretboard
                    orientation={userData.prefs.fretboardRotation}
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
            <FretboardDisplayContext value={{zoom: 1, variant: "preview", outShapeOpacity: 0, type: "chord", orientation: "horizontal"}}>
                <ShapePickerContainer>
                    <ShapePicker
                        onClick={(idx) => {_setActiveShapeIdx(idx)}}
                        active={activeShapeIdx}
                        fingerShapes={chordShapes}
                        setScrollToFret={setScrollToFret}
                        type={"chord"}
                        showLabels={showLabels}
                        shapeMode={shapeMode}
                    />

                    <div className={`flex flex-wrap gap-4 items-start mt-auto min-h-15`}>
                        <ButtonGroup
                            _children={["Shape finder", "Saved shapes"]}
                            onClick={(i) => {
                                switch (i) {
                                    case 0:
                                        setShapeMode("finder")
                                        break
                                    case 1:
                                        setShapeMode("saved")
                                        break
                                }
                            }}
                            active={(() => {
                                if (shapeMode === "finder") return 0
                                if (shapeMode === "saved") return 1
                                return 0
                            })()}
                        />
                        <div className={`flex gap-2 min-w-0 overflow-x-scroll`}>
                            {shapeMode === "saved" &&
                                <div className={`flex flex-col gap-2 text-xs font-light max-w-25`}>
                                    <BinaryToggle state={onlyShapesOnRoot} fn={() => {
                                        setOnlyShapesOnRoot(!onlyShapesOnRoot)
                                    }}/>
                                    <legend className={`text-xs`}>
                                        {`Only ${styleNoteName(chordContext.chord.root)}${chordContext.chord.quality}`}
                                    </legend>
                                    {fitSavedShapes && onlyShapesOnRoot &&
                                        <span className={`text-[.6rem]`}>Also transposing</span>
                                    }
                                </div>
                            }
                        </div>
                    </div>

                </ShapePickerContainer>
            </FretboardDisplayContext>
            <ChordFilters
                chordShapeFilters={chordShapeFilters}
                setChordShapeFilters={setChordShapeFilters}
                filterSavedShapes={filterSavedShapes}
                setFilterSavedShapes={setFilterSavedShapes}
                fitSavedShapes={fitSavedShapes}
                setFitSavedShapes={setFitSavedShapes}
            />
        </>
    )
}