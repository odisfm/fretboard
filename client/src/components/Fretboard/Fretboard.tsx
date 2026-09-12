import type {Scale, ScaleShape} from "@fretboard/shared/src/types/scale.ts";
import Fret from "./Fret.tsx";

type Props = {
    orientation: "horizontal" | "vertical";
    startFret: number;
    endFret: number;
    highlightedShape?: ScaleShape;
    scale: Scale;
    zoom: number;
    renderZeroFret: boolean
}

export default function Fretboard(
    {
        orientation,
        startFret,
        endFret,
        highlightedShape,
        scale,
        zoom,
        renderZeroFret
    }: Props) {
    const fretsToRender = (endFret - startFret) + 1

    let orientationClasses: string
    if (orientation === "horizontal") {
        orientationClasses = `w-lg overflow-x-scroll `
    } else {
        orientationClasses = `h-lg flex-col overflow-y-scroll`
    }

    return (
        <div className={`flex`}>
            {renderZeroFret &&
                <Fret
                    fretNumber={0}
                    scale={scale}
                    zoom={zoom}
                    zeroFret={true}
                    orientation={orientation}
                    highlightedShape={highlightedShape}
                />
            }
            <div className={`flex ${orientationClasses}`}>
                {Array(fretsToRender).fill(null).map((_, i) => (
                    <Fret
                        key={i}
                        orientation={orientation}
                        fretNumber={i + startFret}
                        scale={scale}
                        highlightedShape={highlightedShape}
                        zoom={zoom}
                        zeroFret={false}
                    />
                ))}
            </div>
        </div>
    )
}