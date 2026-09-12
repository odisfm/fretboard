import TuningDemo from "./components/TuningDemo/TuningDemo.tsx";
import Fretboard from "./components/Fretboard/Fretboard.tsx";
import {useTuning} from "./contexts/tuning/useTuning.ts";
import {generateScaleShapes} from "./formulas/generateScaleShapes.ts";
import ShapePicker from "./components/ShapePicker/ShapePicker.tsx";
import {useMemo, useState} from "react";
import Button from "./components/generic/Button.tsx";
import {FaRotate} from "react-icons/fa6";
import {sortScaleShapes} from "./formulas/sortScaleShapes.ts";
import {ScaleDemo} from "./components/ScaleDemo/ScaleDemo.tsx";
import {useScale} from "./contexts/scale/useScale.ts";

export default function FretboardDemo() {
    const scaleContext = useScale()
    const tuningContext = useTuning()
    const tuning = tuningContext.tuning
    const [activeScaleShapeIdx, setActiveScaleShapeIdx] = useState<number>(0);
    const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
    const [scrollToFret, setScrollToFret] = useState<null | number>(null);

    const scaleShapes = useMemo(() => {
        let scaleShapes = generateScaleShapes(
            tuning,
            scaleContext.scale
        )
        scaleShapes = sortScaleShapes(scaleShapes, "lowToHighFretToString")
        return scaleShapes
    }, [scaleContext.scale, tuning, tuning.strings])

    function _setActiveScaleShape(idx: number) {
        setActiveScaleShapeIdx(idx)
    }

    console.log(JSON.stringify(scaleShapes[activeScaleShapeIdx]))

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
            <Fretboard
                orientation={orientation}
                startFret={1}
                endFret={24}
                scale={scaleContext.scale}
                zoom={1}
                renderZeroFret={true}
                highlightedShape={scaleShapes[activeScaleShapeIdx]}
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