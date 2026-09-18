import TuningDemo from "./components/TuningDemo/TuningDemo.tsx";
import {FretboardDisplayContext} from "./contexts/fretboardDisplay/FretboardDisplayContext.ts";
import Fretboard from "./components/Fretboard/Fretboard.tsx";
import {useTuning} from "./contexts/tuning/useTuning.ts";
import {useMemo, useState} from "react";
import Button from "./components/generic/Button.tsx";
import {ScaleDemo} from "./components/ScaleDemo/ScaleDemo.tsx";
import ShapePicker from "./components/ShapePicker/ShapePicker.tsx";
import {generateChordShapes} from "./formulas/chordShapes/generateChordShapes.tsx";
import {useChord} from "./contexts/chord/useChord.ts";
import {chordIntervalsToScaleIntervals} from "@fretboard/shared/utils/chordIntervalsToScaleIntervals"

export function ChordDemo() {
    const tuningContext = useTuning()
    const tuning = tuningContext.tuning
    const [activeShapeIdx, setActiveShapeIdx] = useState<number | null>(null);
    const chordContext = useChord()
    const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
    const [scrollToFret, setScrollToFret] = useState<null | number>(null);
    const [fretboardZoom, setFretboardZoom] = useState<number>(1.5)
    const [outShapeOpacity, setOutShapeOpacity] = useState<number>(.2)
    console.log({setFretboardZoom, setOutShapeOpacity})

    const chordShapes = useMemo(() => {
        return generateChordShapes(
            chordContext.chord,
            tuning,
            {
                fretSpan: 3,
                openStrings: false,
                omissions: [],
                barres: true,
                rootIsBass: true,
                fingers: 4,
                lowFret: 0,
                highFret: 24
            }
        )
    }, [tuning, chordContext.chord])

    return (
        <div className={`flex flex-col gap-2`}>
            <div className={`flex flex-col gap-2`}>
                <TuningDemo/>
                <ScaleDemo />
            </div>

            <FretboardDisplayContext
                value={{zoom: fretboardZoom, variant: "main", outShapeOpacity, type: "chord"}}
            >
                <Fretboard
                    orientation={orientation}
                    startFret={1}
                    endFret={24}
                    scale={{
                        tonic: chordContext.chord.root,
                        intervals: chordIntervalsToScaleIntervals(chordContext.chord.intervals),
                        id: chordContext.chord.id,
                        name: chordContext.chord.quality,
                        order: ""
                    }}
                    renderZeroFret={true}
                    highlightedShape={chordShapes[activeShapeIdx || 0]}
                    scrollToFret={scrollToFret}
                />
            </FretboardDisplayContext>

            <Button
                onClick={() => setOrientation(orientation === "horizontal" ? "vertical" : "horizontal")}
                styles={`px-4 py-2 text-lg self-start`}
                variant={"subtle"}
            >
            </Button>
            <FretboardDisplayContext value={{zoom: 1, variant: "preview", outShapeOpacity: 0, type: "chord"}}>
                <ShapePicker
                    onClick={(idx) => {setActiveShapeIdx(idx)}}
                    active={activeShapeIdx}
                    fingerShapes={chordShapes}
                    setScrollToFret={setScrollToFret}
                />
            </FretboardDisplayContext>
        </div>
    )
}