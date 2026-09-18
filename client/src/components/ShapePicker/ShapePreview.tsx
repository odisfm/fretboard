import Fretboard from "../Fretboard/Fretboard.tsx";
import type {FingerShape} from "@fretboard/shared/types/fingerShape";
import {useScale} from "../../contexts/scale/useScale.ts";
import {useFretboardDisplay} from "../../contexts/fretboardDisplay/useFretboardDisplay.tsx";

type Props = {
    shape: FingerShape
}

export default function ShapePreview(
    {
        shape
    }: Props) {
    const scaleContext = useScale()
    const fdContext = useFretboardDisplay()
    let lowFret = Infinity
    let highFret = -Infinity
    let renderZeroFret = false
    if (fdContext.type === "scale") {
        renderZeroFret = false
        lowFret = shape.lowFret
        highFret = shape.highFret
    } else {
        for (const p of shape.shape) {
            if (p.fret && p.fret < lowFret) lowFret = p.fret
            if (p.fret > highFret) highFret = p.fret
            if (p.fret === 0) renderZeroFret = true
        }
    }

    return (
        <>
            <Fretboard
                orientation={"horizontal"}
                startFret={lowFret}
                endFret={highFret}
                scale={scaleContext.scale}
                renderZeroFret={renderZeroFret}
                highlightedShape={shape}
                scrollToFret={null}
            />
        </>
    )
}