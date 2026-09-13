import TuningDemo from "./components/TuningDemo/TuningDemo.tsx";
import Fretboard from "./components/Fretboard/Fretboard.tsx";
import {useTuning} from "./contexts/tuning/useTuning.ts";
import {
    filterByMinOctaves, filterByOptions,
    generateScaleShapes,
    type GenerateScaleShapesOptions
} from "./formulas/generateScaleShapes.ts";
import ShapePicker from "./components/ShapePicker/ShapePicker.tsx";
import {useMemo, useState} from "react";
import Button from "./components/generic/Button.tsx";
import {FaRotate} from "react-icons/fa6";
import {sortScaleShapes} from "./formulas/sortScaleShapes.ts";
import {ScaleDemo} from "./components/ScaleDemo/ScaleDemo.tsx";
import {useScale} from "./contexts/scale/useScale.ts";
import type {ScaleShape} from "@fretboard/shared/types/scale";
import {useUserData} from "./contexts/userData/useUserData.tsx";
import {isSameScale, isSameShape, isSameTuning} from "@fretboard/shared/utils/isSameStructure";
import {ShapeGenFilter} from "./components/Fretboard/ShapeGenFilter.tsx";
import {fitShapeToNewTonic} from "./formulas/fitShapeToNewTonic.ts";

export default function FretboardDemo() {
    const userDataContext = useUserData();
    const scaleContext = useScale()
    const tuningContext = useTuning()
    const tuning = tuningContext.tuning
    const [activeScaleShapeIdx, setActiveScaleShapeIdx] = useState<number | null>(null);
    const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
    const [scrollToFret, setScrollToFret] = useState<null | number>(null);
    const [shapeGenOptions, setShapeGenOptions] = useState<GenerateScaleShapesOptions>({
        maxPerString: 3,
        maxFretSpan: 4,
        minPerString: 1,
        minOctaves: 1
    });
    const [fretboardZoom, setFretboardZoom] = useState<number>(1.5)
    const [filterSavedShapes, setFilterSavedShapes] = useState(false)
    const [fitSavedShapes, setFitSavedShapes] = useState(true)

    const generatedShapes = useMemo(() => {
        let scaleShapes = generateScaleShapes(
            tuning,
            scaleContext.scale,
            shapeGenOptions
        )
        scaleShapes = sortScaleShapes(scaleShapes, "lowToHighFretToString")
        return scaleShapes
    }, [scaleContext.scale, tuning, shapeGenOptions])

    const relevantSavedShapes: ScaleShape[] = useMemo(() => {
        let relevant: ScaleShape[] = []

        for (const s of userDataContext.shapes) {
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
                        console.log({result})
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
    }, [userDataContext.shapes, tuning, scaleContext.scale, filterSavedShapes, shapeGenOptions, fitSavedShapes])

    const scaleShapes: ScaleShape[] = useMemo(() => {
        const shapes: ScaleShape[] = [...relevantSavedShapes]
        for (const gs of generatedShapes) {
            let isSame = false;
            for (const rs of relevantSavedShapes) {
                if (isSameShape(gs, rs)) {
                    isSame = true;
                    break
                }
            }
            if (!isSame) shapes.push(gs)
        }

        return shapes
    }, [relevantSavedShapes, generatedShapes])

    function _setActiveScaleShape(idx: number | null) {
        setActiveScaleShapeIdx(idx)
    }


    return (
        <div className={`flex flex-col gap-2`}>
            <TuningDemo/>
            <ScaleDemo />
            <div className={`flex gap-2`}>
                <Button
                    onClick={() => setOrientation(orientation === "horizontal" ? "vertical" : "horizontal")}
                    styles={`px-4 py-2 text-lg`}
                >
                    <FaRotate/>
                </Button>
            </div>

            <ShapeGenFilter
                shapeGenOptions={shapeGenOptions}
                setShapeGenOptions={setShapeGenOptions}
                fretboardZoom={fretboardZoom}
                setFretboardZoom={setFretboardZoom}
                filterSavedShapes={filterSavedShapes}
                setFilterSavedShapes={setFilterSavedShapes}
                fitSavedShapes={fitSavedShapes}
                setFitSavedShapes={setFitSavedShapes}
            />

            <Fretboard
                orientation={orientation}
                startFret={1}
                endFret={24}
                scale={scaleContext.scale}
                zoom={fretboardZoom}
                renderZeroFret={true}
                highlightedShape={activeScaleShapeIdx !== null ? scaleShapes[activeScaleShapeIdx] : undefined}
                variant={"main"}
                scrollToFret={scrollToFret}
            />

            <ShapePicker
                onClick={_setActiveScaleShape}
                active={activeScaleShapeIdx}
                scaleShapes={scaleShapes}
                setScrollToFret={setScrollToFret}
            />
        </div>
    )
}