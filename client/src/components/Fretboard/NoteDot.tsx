import type {FretboardVariant} from "./Fretboard.tsx";
import {useScale} from "../../contexts/scale/useScale.ts";
import {midiPitchToNoteName} from "@fretboard/shared/src/utils/midiPitchToNoteName.ts";

export type DotVisibility = "highlight" | "dim" | "none" | "zeroFret"

type Props = {
    pitch: number
    visibility: DotVisibility,
    variant: FretboardVariant,
    degree: number | false
}

export default function NoteDot(
    {
        pitch,
        visibility,
        variant,
        degree
    }: Props) {

    const scaleContext = useScale()
    const dimClasses = `bg-white/50 text-black`
    const noneClasses = `bg-transparent invisible`
    const zeroFretClasses = `bg-neutral-700/75`
    const diameter = variant === "main" ? 30 : 15
    const degreeName = degree !== false ? scaleContext.degreeNumbers[degree] : ""

    let theseClasses = ""
    switch (visibility) {
        case "highlight":
            theseClasses += "font-bold "
            switch(degreeName) {
                case "1":
                case "P1":
                    theseClasses += "bg-red-500"
                    break
                case "5":
                case "P5":
                    theseClasses += "bg-amber-600"
                    break
                default:
                    theseClasses += "bg-white text-black"
                    break
            }
            break;
        case "dim":
            if (variant !== "preview") {
                theseClasses = dimClasses
            }
            break;
        case "none":
            theseClasses = noneClasses
            break;
        case "zeroFret":
            theseClasses = zeroFretClasses
            break;
    }

    let text: string
    if (visibility === "zeroFret") {
        text = midiPitchToNoteName(pitch, false, scaleContext.accidentalPref || "sharps")
    } else {
        switch (scaleContext.intervalPref) {
            case null:
                text = midiPitchToNoteName(pitch, false, scaleContext.accidentalPref || "sharps")
                break
            case "nashville":
            case "interval":
                if (degree === false) {
                    text = ""
                } else {
                    text = scaleContext.degreeNumbers[degree]
                }
                break
        }
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
                {variant === "main" && <span>{text}</span>}
            </div>
        </div>
    )
}