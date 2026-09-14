import type {FretboardVariant} from "./Fretboard.tsx";
import {useScale} from "../../contexts/scale/useScale.ts";
import {midiPitchToNoteName} from "@fretboard/shared/utils/midiPitchToNoteName";
import {useFretboardDisplay} from "../../contexts/fretboardDisplay/useFretboardDisplay.tsx";
import {useAudio} from "../../contexts/audio/useAudio.tsx";

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
    const audioContext = useAudio();
    const fdContext = useFretboardDisplay()
    const scaleContext = useScale()
    if (Number.isNaN(pitch)) return <></> // weird errors happening when deleting string
    const dimClasses = `bg-white text-black`
    const noneClasses = `bg-transparent invisible`
    const zeroFretClasses = `bg-neutral-700/75`
    let diameter = variant === "main" ? 30 : 15
    diameter = diameter * (fdContext.zoom * .7)
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
        text = midiPitchToNoteName(pitch, false, scaleContext.scaleSpelling)
    } else {
        switch (scaleContext.intervalPref) {
            case null:
                text = midiPitchToNoteName(pitch, false, scaleContext.scaleSpelling)
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
        <div className={`cursor-pointer`}
                onClick={() => {if (fdContext.variant === "main") audioContext.playNote(midiPitchToNoteName(pitch))}}
        >
            <div
                className={`
                flex items-center justify-center rounded-full ${theseClasses} text-xs h-7 w-7`
            }
                style={{
                    height: `${diameter}px`,
                    width: `${diameter}px`,
                    opacity: `${visibility === "dim" ? fdContext.outShapeOpacity * 100 : 100}%`
                }}
            >
                {variant === "main" && <span>{text}</span>}
            </div>
        </div>
    )
}