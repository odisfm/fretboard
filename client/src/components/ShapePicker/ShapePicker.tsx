import Button from "../generic/Button.tsx";
import ShapePreview from "./ShapePreview.tsx";
import type {ScaleShape} from "@fretboard/shared/src/types/scale.ts";

type Props = {
    scaleShapes: ScaleShape[],
    active: number | null,
    onClick: (idx: number | null) => void,
    setScrollToFret: (fretNumber: number) => void,
}

export default function ShapePicker({scaleShapes, onClick, active, setScrollToFret}: Props) {
    return (
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
                    <Button
                        onClick={() => {
                            onClick(i)
                            setScrollToFret(s.lowFret)
                        }}
                        variant={active === i ? "default" : "subtle"}
                        styles={`z-30`}
                    >
                        <div
                            className={`flex flex-col`}
                        >
                            <div
                                className={`self-end px-2 rounded-md text-xs ${active === i ? "bg-black" : ""}`}
                            >
                                <span className={`self-end`}><sup>#</sup>{`${i + 1}`}</span>
                            </div>
                            <ShapePreview shape={s}/>
                        </div>
                    </Button>
                )
            })}
        </div>
    )
}