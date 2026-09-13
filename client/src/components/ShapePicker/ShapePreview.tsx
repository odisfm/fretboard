import Fretboard from "../Fretboard/Fretboard.tsx";
import type {ScaleShape} from "@fretboard/shared/types/scale";

type Props = {
    shape: ScaleShape
}

export default function ShapePreview(
    {
        shape
    }: Props) {

    return (
        <>
            <Fretboard
                orientation={"horizontal"}
                startFret={shape.lowFret}
                endFret={shape.highFret}
                scale={shape.scale}
                zoom={1}
                renderZeroFret={false}
                highlightedShape={shape}
                variant={"preview"}
                scrollToFret={null}
            />
        </>
    )
}