import type {Scale, ScaleShape} from "@fretboard/shared/types/scale";
import Fret from "./Fret.tsx";
import {useEffect, useRef} from "react";
import {useFretboardDisplay} from "../../contexts/fretboardDisplay/useFretboardDisplay.tsx";

export type FretboardVariant = "main" | "preview"

type Props = {
    orientation: "horizontal" | "vertical";
    startFret: number;
    endFret: number;
    highlightedShape?: ScaleShape;
    scale: Scale;
    renderZeroFret: boolean;
    scrollToFret: number | null
}

export default function Fretboard(
    {
        orientation,
        startFret,
        endFret,
        highlightedShape,
        scale,
        renderZeroFret,
        scrollToFret
    }: Props) {
    const fdContext = useFretboardDisplay()
    const fretsToRender = (endFret - startFret) + 1
    const fretRefs = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    let orientationClasses: string
    if (orientation === "horizontal") {
        orientationClasses = `${fdContext.variant === "main" && `overflow-x-scroll`} `
        if (fdContext.variant === "main") {
            orientationClasses += ""
        }
    } else {
        orientationClasses = `h-[90vh] flex-col ${fdContext.variant === "main" && `overflow-y-scroll`}`
    }

    useEffect(() => {
        if (scrollToFret === null) return;

        const index = scrollToFret - startFret;


        if (scrollToFret === 0) {
            if (!containerRef.current) {
                return;
            }
            if (orientation === "horizontal") {
                containerRef.current.scrollTo({
                    left: 0,
                    behavior: "smooth",
                });
            } else {
                containerRef.current.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }
        } else {
            const el = fretRefs.current[index];
            if (!el) return;
            el.scrollIntoView({
                behavior: "smooth",
                block: orientation === "vertical" ? "start" : "nearest",
                inline: orientation === "horizontal" ? "start" : "nearest",
            });
        }
    }, [scrollToFret, orientation, startFret]);

    return (
        <div className={`flex ${orientation === "vertical" && `flex-col w-md`}`}>
            {renderZeroFret &&
                <Fret
                    fretNumber={0}
                    scale={scale}
                    zeroFret={true}
                    orientation={orientation}
                    highlightedShape={highlightedShape}
                    ref={(el) => { fretRefs.current[0] = el; }}

                />
            }
            <div className={`flex ${orientationClasses}`} ref={containerRef}>
                {Array(fretsToRender).fill(null).map((_, i) => {
                    return (
                        <Fret
                            key={i}
                            orientation={orientation}
                            fretNumber={i + startFret}
                            scale={scale}
                            highlightedShape={highlightedShape}
                            zeroFret={false}
                            ref={(el) => {
                                fretRefs.current[i] = el;
                            }}
                        />
                    )
                })}
            </div>
        </div>
    )
}