import Fretboard from "./components/Fretboard/Fretboard.tsx";
import {useTuning} from "./contexts/tuning/useTuning.ts";
import {
    filterByMinOctaves, filterByOptions,
    generateScaleShapes,
    type GenerateScaleShapesOptions
} from "./formulas/scaleShapes/generateScaleShapes.ts";
import ShapePicker from "./components/ShapePicker/ShapePicker.tsx";
import {useMemo, useState} from "react";
import {sortScaleShapes, sortScaleShapesStrategies, type SortScaleShapesStrategy} from "./formulas/scaleShapes/sortScaleShapes.ts";
import {ScaleDemo} from "./components/ScaleDemo/ScaleDemo.tsx";
import {useScale} from "./contexts/scale/useScale.ts";
import type {ScaleShape} from "@fretboard/shared/types/scale";
import {useUserData} from "./contexts/userData/useUserData.tsx";
import {isSameScale, isSameScaleShape, isSameTuning} from "@fretboard/shared/utils/isSameStructure";
import {ShapeGenFilter} from "./components/Fretboard/ShapeGenFilter.tsx";
import {fitShapeToNewTonic} from "./formulas/scaleShapes/fitShapeToNewTonic.ts";
import {FretboardDisplayContext} from "./contexts/fretboardDisplay/FretboardDisplayContext.ts";

function dedupeShapes(shapes: ScaleShape[]): ScaleShape[] {
    const result: ScaleShape[] = []
    for (const shape of shapes) {
        const idx = result.findIndex(existing => isSameScaleShape(shape, existing))
        if (idx === -1) {
            result.push(shape)
        } else if (result[idx].isAdjusted && !shape.isAdjusted) {
            result[idx] = shape
        }
    }
    return result
}

export default function FretboardDemo() {
    const userDataContext = useUserData();
    const scaleContext = useScale()
    const tuningContext = useTuning()
    const tuning = tuningContext.tuning
    const [activeScaleShapeIdx, setActiveScaleShapeIdx] = useState<number | null>(null);
    const [scrollToFret, setScrollToFret] = useState<null | number>(null);
    const [shapeGenOptions, setShapeGenOptions] = useState<GenerateScaleShapesOptions>({
        maxPerString: 3,
        maxFretSpan: 4,
        minPerString: 1,
        minOctaves: 1
    });
    const [filterSavedShapes, setFilterSavedShapes] = useState(false)
    const [fitSavedShapes, setFitSavedShapes] = useState(true)
    const [sortScaleShapeStrategy, setSortScaleShapeStrategy] =
        useState<SortScaleShapesStrategy>(sortScaleShapesStrategies[0].strategy)

    const generatedShapes = useMemo(() => {
        let scaleShapes = generateScaleShapes(
            tuning,
            scaleContext.scale,
            shapeGenOptions
        )
        scaleShapes = sortScaleShapes(scaleShapes, sortScaleShapeStrategy)
        return scaleShapes
    }, [scaleContext.scale, tuning, shapeGenOptions, sortScaleShapeStrategy])

    const relevantSavedShapes: ScaleShape[] = useMemo(() => {
        let relevant: ScaleShape[] = []

        for (const s of userDataContext.scaleShapes) {
            if (!fitSavedShapes) {
                if (!isSameScale(s.scale, scaleContext.scale, true)) continue
                if (!isSameTuning(tuning, s.tuning, true)) continue
                relevant.push(s)
            } else {
                if (isSameScale(s.scale, scaleContext.scale, false)){
                    if (isSameTuning(tuning, s.tuning, true)) {
                        if (s.scale.tonic === scaleContext.scale.tonic) {
                            relevant.push(s)
                            continue
                        }
                        const result = fitShapeToNewTonic(s, scaleContext.scale.tonic)
                        if (result) {
                            relevant.push(result)
                        }
                    }
                }
            }
        }

        if (filterSavedShapes) {
            relevant = filterByMinOctaves(relevant, shapeGenOptions.minOctaves || 0, scaleContext.scale.intervals.length)
            relevant = filterByOptions(relevant, shapeGenOptions)
        }

        return relevant
    }, [userDataContext.scaleShapes, tuning, scaleContext.scale, filterSavedShapes, shapeGenOptions, fitSavedShapes])

    const scaleShapes: ScaleShape[] = useMemo(() => {
        const dedupedSaved = dedupeShapes(relevantSavedShapes).sort((a, b) => {
            if (a?.isAdjusted && b?.isAdjusted) return 0
            else if (a?.isAdjusted && !b?.isAdjusted) return 1
            else  return -1
        })
        const shapes: ScaleShape[] = [...dedupedSaved]
        for (const gs of generatedShapes) {
            if (!dedupedSaved.some(rs => isSameScaleShape(gs, rs))) {
                shapes.push(gs)
            }
        }
        return shapes
    }, [relevantSavedShapes, generatedShapes])

    function _setActiveScaleShape(idx: number | null) {
        setActiveScaleShapeIdx(idx)
    }


    return (
        <>
            <ScaleDemo/>

            <FretboardDisplayContext
                value={{
                    zoom: userDataContext.prefs.fretboardZoom,
                    variant: "main",
                    outShapeOpacity: userDataContext.prefs.scaleOutOpacity,
                    type: "scale"
            }}
            >
                <Fretboard
                    orientation={userDataContext.prefs.fretboardRotation}
                    startFret={1}
                    endFret={24}
                    scale={scaleContext.scale}
                    renderZeroFret={true}
                    highlightedShape={activeScaleShapeIdx !== null ? scaleShapes[activeScaleShapeIdx] : undefined}
                    scrollToFret={scrollToFret}
                />
            </FretboardDisplayContext>

            <FretboardDisplayContext value={{variant: "preview", zoom: 1.0, outShapeOpacity: 0, type: "scale"}}>
                <ShapePicker
                    onClick={_setActiveScaleShape}
                    active={activeScaleShapeIdx}
                    fingerShapes={scaleShapes}
                    setScrollToFret={setScrollToFret}
                    type={"scale"}
                />
            </FretboardDisplayContext>

            <ShapeGenFilter
                shapeGenOptions={shapeGenOptions}
                setShapeGenOptions={setShapeGenOptions}
                filterSavedShapes={filterSavedShapes}
                setFilterSavedShapes={setFilterSavedShapes}
                fitSavedShapes={fitSavedShapes}
                setFitSavedShapes={setFitSavedShapes}
                sortScaleShapeStrategy={sortScaleShapeStrategy}
                setSortScaleShapeStrategy={setSortScaleShapeStrategy}
            />
        </>
    )
}