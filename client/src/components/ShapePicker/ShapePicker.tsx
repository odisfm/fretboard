import Button from "../generic/Button.tsx";
import type {ScaleShape} from "@fretboard/shared/types/scale";
import ShapeButton from "./ShapeButton.tsx";
import {FretboardDisplayContext} from "../../contexts/fretboardDisplay/FretboardDisplayContext.ts";

type Props = {
    scaleShapes: ScaleShape[],
    active: number | null,
    onClick: (idx: number | null) => void,
    setScrollToFret: (fretNumber: number) => void,
}

export default function ShapePicker({scaleShapes, onClick, active, setScrollToFret}: Props) {
    return (
        <FretboardDisplayContext value={{zoom: 1, variant: "preview", outShapeOpacity: 0}}>
            <div className={`flex w-full p-2 gap-4 overflow-x-scroll`}>
                <Button
                    onClick={() => {
                        onClick(null)
                    }}
                    variant={active === null ? "default" : "subtle"}
                >
                    {"Whole fretboard"}
                </Button>
                {scaleShapes.map((s, i) => {
                    return (
                        <ShapeButton scaleShape={s} index={i} active={active} onClick={onClick}
                                     setScrollToFret={setScrollToFret}/>
                    )
                })}
            </div>
        </FretboardDisplayContext>
    )
}