import Button from "../generic/Button.tsx";
import ShapePreview from "./ShapePreview.tsx";
import type {ScaleShape} from "@fretboard/shared/src/types/scale.ts";

type Props = {
    scaleShapes: ScaleShape[],
    active: number,
    onClick: (idx: number) => void
}

export default function ShapePicker({scaleShapes, onClick, active}: Props) {
    return (
        <div className={`flex w-full p-2 gap-4 overflow-x-scroll`}>
            {scaleShapes.map((s, i) => {
                return (
                    <Button
                        onClick={() => onClick(i)}
                        variant={active === i ? "default" : "subtle"}
                    >
                        <div
                            className={`flex flex-col`}
                        >
                            <span className={`self-end`}>{`#${i+1}`}</span>
                            <ShapePreview shape={s}/>
                        </div>
                    </Button>
                )
            })}
        </div>
    )
}