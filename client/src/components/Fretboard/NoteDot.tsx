import type {FretboardVariant} from "./Fretboard.tsx";
import {useScale} from "../../contexts/scale/useScale.ts";
import {midiPitchToNoteName} from "@fretboard/shared/utils/midiPitchToNoteName";
import {useFretboardDisplay} from "../../contexts/fretboardDisplay/useFretboardDisplay.tsx";
import {useAudio} from "../../contexts/audio/useAudio.tsx";
import type {Finger} from "@fretboard/shared/types/chord";
import {useChord} from "../../contexts/chord/useChord.ts";
import { RxCross2 } from "react-icons/rx";
import {useMemo} from "react";

export type DotVisibility = "highlight" | "dim" | "none" | "zeroFret"

export type ZeroFretType = null | "dead" | "open" | "inKey" | "outKey" | "irrelevant"

type Props = {
    pitch: number
    visibility: DotVisibility,
    variant: FretboardVariant,
    degree: number | false,
    barre?: BarreType,
    finger?: Finger,
    zeroFretType: ZeroFretType
    stringIndex: number
    fretNumber: number
}

export type BarreType = null | "top" | "middle" | "bottom"

export default function NoteDot(
    {
        pitch,
        visibility,
        variant,
        degree,
        zeroFretType,
        barre,
        stringIndex,
        fretNumber
    }: Props) {
    const audioContext = useAudio();
    const fdContext = useFretboardDisplay()
    const scaleContext = useScale()
    const chordContext = useChord()
    const dimClasses = `bg-white text-black`
    const noneClasses = `bg-transparent invisible`
    const zeroFretClasses = `bg-neutral-700/75`
    let diameter = variant === "main" ? 30 : 15
    diameter = diameter * (fdContext.zoom * .7)
    let degreeName: string
    let spelling: "sharps" | "flats"
    if (fdContext.type === "scale") {
        degreeName = degree !== false ? scaleContext.degreeNumbers[degree] : ""
        spelling = scaleContext.scaleSpelling
    } else  {
        degreeName = degree !== false ? chordContext.toneNumbers[degree] : ""
        spelling = chordContext.chordSpelling
    }

    const fingerNumber: string | null = useMemo(() => {
        if (fdContext.type !== "chord") return null
        const shape = chordContext.chordShape
        if (barre) {
            for (const b of (shape?.barres) || []) {
                if (b.fret === fretNumber && b.fromString <= stringIndex && b.toString >= stringIndex) {
                    return String(b.finger)
                }
            }
        } else {
            for (const p of (shape?.shape) || []) {
                if (p.fret === fretNumber && p.stringIndex === stringIndex) {
                    return String(p.finger) || "?"
                }
            }
        }
        return null
    }, [chordContext.chordShape, barre, fretNumber, stringIndex, fdContext.type])

    const zeroFretMain = zeroFretType && fdContext.variant === "main"
    let theseClasses = " "
    if (zeroFretMain) theseClasses += `border-4 `

    if (visibility === "highlight" || (visibility === "zeroFret" && zeroFretType === "open")) {
        theseClasses += "font-bold "
        switch(degreeName) {
            case "1":
            case "P1":
                if (!zeroFretMain) {
                    theseClasses += "bg-red-500 "
                } else {
                    theseClasses += "bg-red-500/50 border-red-500 "
                }
                break
            case "5":
            case "P5":
                if (!zeroFretMain) {
                    theseClasses += "bg-amber-500 "
                } else {
                    theseClasses += "bg-amber-500/50 border-amber-500 "
                }
                break
            default:
                theseClasses += `text-black `
                if (!zeroFretMain) {
                    theseClasses += "bg-white "
                } else {
                    theseClasses += "bg-white/70 border-white"
                }

                break
        }
    } else if (visibility === "dim") {
        if (variant !== "preview") {
            theseClasses = dimClasses
        }
    } else if (visibility === "none") {
        if (!barre) {
            theseClasses = noneClasses
        }
    } else if (visibility === "zeroFret") {
        if (zeroFretType === "irrelevant") {
            theseClasses = noneClasses
        } else {
            theseClasses = zeroFretClasses
        }
    }

    if (Number.isNaN(pitch)) return <></> // weird errors happening when deleting string

    let text = ""
    if (visibility === "none" || fdContext.variant === "preview") {
        text = ""
    }
    else if (visibility === "zeroFret" && fdContext.type === "scale") {
        text = midiPitchToNoteName(pitch, false, spelling)
    } else {
        if (fdContext.type === "scale") {
            switch (scaleContext.intervalPref) {
                case null:
                    text = midiPitchToNoteName(pitch, false, spelling)
                    break
                case "nashville":
                case "interval":
                    if (degree === false) {
                        text = ""
                    } else {
                        text = scaleContext.degreeNumbers[degree]
                    }
                    break

                default:
                    text = ""
                    break
            }
        } else if (fdContext.type === "chord") {
            switch (chordContext.intervalPref) {
                case null:
                case "note":
                    text = midiPitchToNoteName(pitch, false, spelling)
                    break
                case "interval":
                    if (degree !== false) {
                        text = chordContext.toneNumbers[degree]
                    }
                    break
                case "finger":
                    text = fingerNumber || "?"
                    break
                default:
                    text = ""
                    break
            }
        }
    }

    if (zeroFretType) {
        if (zeroFretType === "dead") {
            return <RxCross2 size={40}/>
        }
        if (zeroFretType === "irrelevant") {
            return null
        }
    }

    let roundingClass = ""
    if (!barre) {
        roundingClass = "rounded-full  "
    } else if (barre === "top") {
        roundingClass = "rounded-b-full"
    } else if (barre === "bottom") {
        roundingClass = "rounded-t-full "
    } else {
        roundingClass = " "
    }

    return (
        <div className={`
        cursor-pointer mt-2 h-full
        ${barre && `bg-neutral-400/50 ${roundingClass}`}`}
                onClick={() => {
                    if (fdContext.variant === "main") audioContext.playNote(midiPitchToNoteName(pitch))
                }}
        >
            <div
                className={`
                flex items-center justify-center ${theseClasses} rounded-full text-xs h-7 w-7`
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