import {midiPitchToNoteName} from "@fretboard/shared/src/utils/midiPitchToNoteName.ts";
import type {FretboardVariant} from "./Fretboard.tsx";

export type DotVisibility = "highlight" | "dim" | "none" | "zeroFret"

type Props = {
    pitch: number
    visibility: DotVisibility,
    variant: FretboardVariant
}

export default function NoteDot(
    {
        pitch,
        visibility,
        variant,
    }: Props) {

    const highlightClasses = `bg-cyan-500`
    const dimClasses = `bg-cyan-800`
    const noneClasses = `bg-transparent invisible`
    const zeroFretClasses = `bg-neutral-700/75`
    const diameter = variant === "main" ? 30 : 15

    let theseClasses = ""
    switch (visibility) {
        case "highlight":
            theseClasses = highlightClasses
            break;
        case "dim":
            theseClasses = dimClasses
            break;
        case "none":
            theseClasses = noneClasses
            break;
        case "zeroFret":
            theseClasses = zeroFretClasses
            break;
    }

    return (
        <div className={``}>
            <div
                className={`
                flex items-center justify-center rounded-full ${theseClasses} text-xs h-7 w-7`
            }
                style={{
                    height: `${diameter}px`,
                    width: `${diameter}px`
                }}
            >
                {variant === "main" && <span>{midiPitchToNoteName(pitch, false)}</span>}
            </div>
        </div>
    )
}