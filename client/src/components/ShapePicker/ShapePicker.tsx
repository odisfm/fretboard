import { Virtuoso } from 'react-virtuoso'
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
            <div className="flex w-full p-2 gap-4">
                <Button
                    onClick={() => {
                        onClick(null)
                    }}
                    variant={active === null ? "default" : "subtle"}
                >
                    {"Whole fretboard"}
                </Button>
                <Virtuoso
                    horizontalDirection
                    style={{height: 200, flex: 1}}
                    data={scaleShapes}
                    computeItemKey={(index) => index}
                    itemContent={(index, scaleShape) => (
                        <div className="pr-4 h-full flex items-center">
                            <ShapeButton
                                scaleShape={scaleShape}
                                index={index}
                                active={active}
                                onClick={onClick}
                                setScrollToFret={setScrollToFret}
                            />
                        </div>
                    )}
                />
            </div>
        </FretboardDisplayContext>
    )
}