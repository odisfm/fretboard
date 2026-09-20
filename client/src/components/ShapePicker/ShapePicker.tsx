import { Virtuoso } from 'react-virtuoso'
import Button from "../generic/Button.tsx";
import ShapeButton from "./ShapeButton.tsx";
import type {FingerShape} from "@fretboard/shared/types/fingerShape";
import {FaPalette} from "react-icons/fa";

type Props = {
    fingerShapes: FingerShape[],
    active: number | null,
    onClick: (idx: number | null) => void,
    setScrollToFret: (fretNumber: number) => void,
    type: "scale" | "chord"
    showLabels: boolean,
}

export default function ShapePicker({fingerShapes, onClick, active, setScrollToFret, type, showLabels}: Props) {
    return (
            <div className="flex w-full p-2 gap-4 min-h-55">
                <Button
                    onClick={() => {
                        onClick(null)
                    }}
                    variant={active === null ? "default" : "subtle"}
                    styles={`w-20 flex flex-col items-center justify-center p-4 border-2! border-white/10! `}
                >
                    <FaPalette/>
                    <span>{"Whole fretboard"}</span>
                </Button>
                {fingerShapes.length === 0 &&
                    <span className={`self-center w-xs text-center p-4 rounded-md bg-red-950`}>
                        {`Couldn't construct any ${type} shapes matching your parameters.`}
                    </span>
                }
                <Virtuoso
                    horizontalDirection
                    style={{height: 200, flex: 1}}
                    data={fingerShapes}
                    computeItemKey={(index) => index}
                    itemContent={(index, shape) => (
                        <div className="pr-4 h-full flex items-start">
                            <ShapeButton
                                fingerShape={shape}
                                index={index}
                                active={active}
                                onClick={onClick}
                                setScrollToFret={setScrollToFret}
                                showLabel={showLabels}
                            />
                        </div>
                    )}
                />
            </div>
    )
}