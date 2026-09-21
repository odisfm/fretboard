import Button from "../generic/Button.tsx";
import ShapePreview from "./ShapePreview.tsx";
import FavButton from "../generic/FavButton.tsx";
import {useUserData} from "../../contexts/userData/useUserData.tsx";
import {useMemo} from "react";
import type {FingerShape} from "@fretboard/shared/types/fingerShape";
import type {NoteName, ScaleShape} from "@fretboard/shared/types/scale";
import {useFretboardDisplay} from "../../contexts/fretboardDisplay/useFretboardDisplay.tsx";
import {useFeature} from "../../contexts/feature/useFeature.ts";
import type {ChordShape} from "@fretboard/shared/types/chord";
import {styleNoteName} from "@fretboard/shared/utils/styleNoteName";
import {midiPitchToNoteName} from "@fretboard/shared/utils/midiPitchToNoteName";
import {useAudio} from "../../contexts/audio/useAudio.tsx";
import {PiSpeakerNoneFill} from "react-icons/pi";

type Props = {
    onClick: (index: number) => void;
    setScrollToFret: (index: number) => void;
    active: number | null;
    fingerShape: FingerShape;
    index: number
    showLabel: boolean;
}

export default function ShapeButton({onClick, setScrollToFret, fingerShape, index, active, showLabel}: Props) {
    const userDataContext = useUserData()
    const fdContext = useFretboardDisplay()
    const featureContext = useFeature()
    const audioContext = useAudio()
    const isFav = useMemo(() => {
        let arr
        if (featureContext.feature === "scale") arr = userDataContext.scaleShapes
        if (featureContext.feature === "chord") arr = userDataContext.chordShapes
        return arr!.findIndex((s) => s.id === fingerShape.id) !== -1

    }, [userDataContext.scaleShapes, userDataContext.chordShapes, fingerShape, featureContext.feature])

    function toggleFav(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault()
        e.stopPropagation();
        if (fingerShape?.scale) {
            userDataContext.toggleSavedScaleShape(fingerShape as ScaleShape)
        } else if (fingerShape?.chord) {
            userDataContext.toggleSavedChordShape(fingerShape as ChordShape)
        }
    }

    const scrollToFret = useMemo(() => {
        if (fdContext.type === "scale") {
            return fingerShape.lowFret
        } else {
            let lowFret = Infinity
            for (const p of fingerShape.shape) {
                if (p.fret && p.fret < lowFret) lowFret = p.fret
            }
            return lowFret > 3 ? lowFret : 0
        }
    }, [fingerShape, fdContext.type])

    const favShapeFitted = isFav && fingerShape?.isAdjusted

    const label = useMemo(() => {
        if (!showLabel) return ""
        if (fdContext.type === "scale") {
            return `${fingerShape.scale?.tonic} ${fingerShape.scale?.name}${fingerShape.isAdjusted ? "*" : ""}`
        } else if (fdContext.type === "chord") {
            return `
            ${styleNoteName(fingerShape.chord?.root as NoteName || "")}${fingerShape.chord?.quality}
            ${fingerShape.isAdjusted ? "*" : ""}
            `
        }
        return ""
    }, [fingerShape, fdContext.type, showLabel])

    const pitches: string[] = useMemo(() => {
        const pitches: string[] = []
        if (fdContext.type === "scale") return []
        else if (fdContext.type === "chord") {
            for (const pos of fingerShape.shape) {
                const pitch = fingerShape.tuning.strings[pos.stringIndex] + pos.fret
                pitches.push(midiPitchToNoteName(pitch))
            }
        }
        return pitches
    }, [fdContext.type, fingerShape])

    return (

            <div
                className={`flex flex-col gap-1`}
            >
                <div className={`flex items-center w-full`}>
                    <FavButton
                        active={isFav}
                        onClick={toggleFav}
                        styles={`self-start`}
                        extraHeartStyles={`${favShapeFitted && `!text-lime-400`}`}
                    />
                    {pitches.length > 0 &&
                        <Button
                            variant={"subtle"}
                            onClick={() => {
                                audioContext.playNotes(pitches, "1b", 0.3, true)
                            }}
                        >
                            <PiSpeakerNoneFill />
                        </Button>
                    }
                    <span className={`ml-auto text-xs font-bold`}><sup>#</sup>{`${index + 1}`}</span>
                </div>
                <Button
                    onClick={() => {
                        onClick(index)
                        setScrollToFret(scrollToFret)
                    }}
                    variant={active === index ? "default" : "subtle"}
                    styles={`z-30`}
                >
                <ShapePreview shape={fingerShape}/>
                </Button>
                {showLabel &&
                    <span className={`text-sm font-light`}>{label}</span>
                }
            </div>
    )
}
