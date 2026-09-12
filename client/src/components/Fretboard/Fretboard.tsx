import type {Scale, ScaleShape} from "@fretboard/shared/src/types/scale.ts";
import Fret from "./Fret.tsx";

export type FretboardVariant = "main" | "preview"

type Props = {
    orientation: "horizontal" | "vertical";
    startFret: number;
    endFret: number;
    highlightedShape?: ScaleShape;
    scale: Scale;
    zoom: number;
    renderZeroFret: boolean;
    variant: FretboardVariant
}

export default function Fretboard(
    {
        orientation,
        startFret,
        endFret,
        highlightedShape,
        scale,
        zoom,
        renderZeroFret,
        variant
    }: Props) {
    const fretsToRender = (endFret - startFret) + 1

    let orientationClasses: string
    if (orientation === "horizontal") {
        orientationClasses = `overflow-x-scroll `
        if (variant === "main") {
            orientationClasses += ""
        }
    } else {
        orientationClasses = `max-h-[60vh] flex-col overflow-y-scroll`
    }

    return (
        <div className={`flex ${orientation === "vertical" && `flex-col w-md`}`}>
            {renderZeroFret &&
                <Fret
                    fretNumber={0}
                    scale={scale}
                    zoom={1}
                    zeroFret={true}
                    orientation={orientation}
                    highlightedShape={highlightedShape}
                    variant={variant}
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
                        variant={variant}
                    />
                ))}
            </div>
        </div>
    )
}