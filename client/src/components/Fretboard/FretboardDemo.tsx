import TuningDemo from "../TuningDemo/TuningDemo.tsx";
import Fretboard from "./Fretboard.tsx";
import {useTuning} from "../../contexts/tuning/useTuning.ts";
import {generateScaleShapes} from "../../formulas/generateScaleShapes.ts";
import type {NoteName} from "@fretboard/shared/src/types/scale.ts";
import ShapePicker from "../ShapePicker/ShapePicker.tsx";
import {useState} from "react";
import Button from "../generic/Button.tsx";
import {FaRotate} from "react-icons/fa6";

const gMajor = {
    name: "G Major",
    intervals: [2, 2, 1, 2, 2, 2, 1],
    tonic: "G" as NoteName
}

export default function FretboardDemo() {
    const tuningContext = useTuning()
    const tuning = tuningContext.tuning
    const [activeScaleShapeIdx, setActiveScaleShapeIdx] = useState<number>(0);
    const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
    const scaleShapes = generateScaleShapes(
        tuning,
        gMajor
    )

    function _setActiveScaleShape(idx: number) {
        setActiveScaleShapeIdx(idx)
    }

    console.log(JSON.stringify(scaleShapes[activeScaleShapeIdx]))

    return (
        <>
            <TuningDemo/>
            <Button
                onClick={() => setOrientation(orientation === "horizontal" ? "vertical" : "horizontal")}
            >
                <FaRotate/>
            </Button>
            <Fretboard
                orientation={orientation}
                startFret={1}
                endFret={24}
                scale={gMajor}
                zoom={1}
                renderZeroFret={true}
                highlightedShape={scaleShapes[activeScaleShapeIdx]}
                variant={"main"}
            />

            <ShapePicker
                onClick={_setActiveScaleShape}
                active={activeScaleShapeIdx}
                scaleShapes={scaleShapes}
            />
        </>
    )
}