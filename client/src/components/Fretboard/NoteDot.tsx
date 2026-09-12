import {midiPitchToNoteName} from "@fretboard/shared/src/utils/midiPitchToNoteName.ts";

export type DotVisibility = "highlight" | "dim" | "none" | "zeroFret"

type Props = {
    pitch: number
    visibility: DotVisibility
}

export default function NoteDot(
    {
        pitch,
        visibility
    }: Props) {

    const highlightClasses = `bg-cyan-500`
    const dimClasses = `bg-cyan-800`
    const noneClasses = `bg-transparent invisible`
    const zeroFretClasses = `bg-neutral-700/75`

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
            <div className={`flex items-center justify-center rounded-full ${theseClasses} text-xs h-7 w-7`}>
                <span>{midiPitchToNoteName(pitch, false)}</span>
            </div>
        </div>
    )
}