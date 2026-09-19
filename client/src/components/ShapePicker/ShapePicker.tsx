import { Virtuoso } from 'react-virtuoso'
import Button from "../generic/Button.tsx";
import ShapeButton from "./ShapeButton.tsx";
import type {FingerShape} from "@fretboard/shared/types/fingerShape";

type Props = {
    fingerShapes: FingerShape[],
    active: number | null,
    onClick: (idx: number | null) => void,
    setScrollToFret: (fretNumber: number) => void,
    type: "scale" | "chord"
}

export default function ShapePicker({fingerShapes, onClick, active, setScrollToFret, type}: Props) {
    return (
            <div className="flex w-full p-2 gap-4">
                <Button
                    onClick={() => {
                        onClick(null)
                    }}
                    variant={active === null ? "default" : "subtle"}
                >
                    {"Whole fretboard"}
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
                        <div className="pr-4 h-full flex items-center">
                            <ShapeButton
                                fingerShape={shape}
                                index={index}
                                active={active}
                                onClick={onClick}
                                setScrollToFret={setScrollToFret}
                            />
                        </div>
                    )}
                />
            </div>
    )
}