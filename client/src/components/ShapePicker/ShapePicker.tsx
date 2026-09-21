import { Virtuoso } from 'react-virtuoso'
import Button from "../generic/Button.tsx";
import ShapeButton from "./ShapeButton.tsx";
import type {FingerShape} from "@fretboard/shared/types/fingerShape";
import {FaPalette} from "react-icons/fa";
import {useMemo} from "react";
import {useChord} from "../../contexts/chord/useChord.ts";
import {useScale} from "../../contexts/scale/useScale.ts";

type Props = {
    fingerShapes: FingerShape[],
    active: number | null,
    onClick: (idx: number | null) => void,
    setScrollToFret: (fretNumber: number) => void,
    type: "scale" | "chord"
    showLabels: boolean,
    shapeMode: "finder" | "saved"
}

export default function ShapePicker({fingerShapes, onClick, active, setScrollToFret, type, showLabels, shapeMode}: Props) {
    const chordContext = useChord()
    const scaleContext = useScale()

    const failureText = useMemo(() => {
        if (shapeMode === "finder") {
            return `Couldn't construct any ${type} shapes matching your parameters.`

        } else if (shapeMode === "saved") {
            if (type === "chord") {
                return `No saved ${chordContext.chord.quality} chord shapes matching your parameters.`
            } else if (type === "scale") {
                return `No saved ${scaleContext.scale.name} scale shapes matching your parameters.`
            }
        }

        return ""
    }, [type, shapeMode, chordContext.chord.quality, scaleContext.scale])

    return (
            <div className="flex w-full p-2 gap-4 min-h-55">
                <Button
                    onClick={() => {
                        onClick(null)
                    }}
                    variant={active === null ? "default" : "subtle"}
                    styles={`
                    self-center h-min w-20 flex flex-col items-center justify-center p-4 border-2! border-white/10! 
                    py-4
                    `}
                >
                    <FaPalette/>
                    <span>{"Whole fretboard"}</span>
                </Button>
                {fingerShapes.length === 0 &&
                    <span className={`self-center w-xs text-center p-4 rounded-md bg-red-950`}>
                        {failureText}
                    </span>
                }
                <Virtuoso
                    horizontalDirection
                    style={{height: 250, flex: 1}}
                    className={`overflow-y-hidden`}
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