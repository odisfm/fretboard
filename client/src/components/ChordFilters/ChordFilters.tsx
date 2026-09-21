import {
    type GenerateChordShapeOptions, MAXIMUM_FINGERS,
    MAXIMUM_FRET_SPAN, MINIMUM_FINGERS,
    MINIMUM_FRET_SPAN
} from "../../formulas/chordShapes/generateChordShapes.tsx";
import {BinaryToggle} from "../generic/BinaryToggle.tsx";
import {NumberStepper} from "../generic/NumberStepper.tsx";
import {useTuning} from "../../contexts/tuning/useTuning.ts";
import {useEffect} from "react";
import Tooltip from "../generic/Tooltip.tsx";

type Props = {
    chordShapeFilters: GenerateChordShapeOptions,
    setChordShapeFilters: (value: GenerateChordShapeOptions) => void,
    fitSavedShapes: boolean
    setFitSavedShapes: (value: boolean) => void,
    filterSavedShapes: boolean
    setFilterSavedShapes: (value: boolean) => void,
}

const fieldsetStyles = `grid grid-rows-[1fr_1fr] gap-3 items-start`
const legendStyles = `text-xs font-light`
const stepperButtonStyles = `bg-neutral-900`
const displayStyles = `bg-neutral-800`


export function ChordFilters(
    {
        chordShapeFilters,
        setChordShapeFilters,
        fitSavedShapes,
        setFitSavedShapes,
        filterSavedShapes,
        setFilterSavedShapes,
    }: Props) {
    const tuningContext = useTuning()

    useEffect(() => {
        if (chordShapeFilters.highFret > tuningContext.tuning.fretCount) {
            setChordShapeFilters({...chordShapeFilters, highFret: tuningContext.tuning.fretCount})
        }
        if (chordShapeFilters.lowFret > tuningContext.tuning.fretCount) {
            setChordShapeFilters({...chordShapeFilters, lowFret: tuningContext.tuning.fretCount})
        }
    }, [tuningContext.tuning, chordShapeFilters, setChordShapeFilters])

    function incrementFretSpan(increment: number) {
        let newValue = chordShapeFilters.fretSpan + increment;
        if (newValue < MINIMUM_FRET_SPAN) {
            newValue = MINIMUM_FRET_SPAN;
        } else if (newValue > MAXIMUM_FRET_SPAN) {
            newValue = MAXIMUM_FRET_SPAN;
        }
        setChordShapeFilters({...chordShapeFilters, fretSpan: newValue});
    }

    function incrementFingers(increment: number) {
        let newValue = chordShapeFilters.fingers + increment;
        if (newValue < MINIMUM_FINGERS) {
            newValue = MINIMUM_FINGERS;
        } else if (newValue > MAXIMUM_FINGERS) {
            newValue = MAXIMUM_FINGERS;
        }
        setChordShapeFilters({...chordShapeFilters, fingers: newValue});
    }

    function incrementLowFret(increment: number) {
        let newValue = chordShapeFilters.lowFret + increment;
        if (newValue < 0) {
            newValue = 0
        } else if (newValue > tuningContext.tuning.fretCount ) {
            newValue = tuningContext.tuning.fretCount
        }
        setChordShapeFilters({...chordShapeFilters, lowFret: newValue});
    }

    function incrementHighFret(increment: number) {
        let newValue = chordShapeFilters.highFret + increment;
        if (newValue < 0) {
            newValue = 0
        } else if (newValue > tuningContext.tuning.fretCount ) {
            newValue = tuningContext.tuning.fretCount
        }
        setChordShapeFilters({...chordShapeFilters, highFret: newValue});
    }

    return (
        <div className={`p-4 rounded-md bg-neutral-950`}>
            <h3 className={`font-bold mb-4`}>Filters</h3>
            <div className={`flex flex-wrap gap-4 `}>
                <div className={fieldsetStyles}>
                    <BinaryToggle
                        state={chordShapeFilters.barres}
                        fn={(state) => setChordShapeFilters({...chordShapeFilters, barres: state})}
                    />
                    <legend className={legendStyles}>
                        Barres
                    </legend>
                </div>
                <div className={fieldsetStyles}>
                    <BinaryToggle
                        state={chordShapeFilters.openStrings}
                        fn={(state) => setChordShapeFilters({...chordShapeFilters, openStrings: state})}
                    />
                    <legend className={legendStyles}>
                        Open strings
                    </legend>
                </div>
                <div className={fieldsetStyles}>
                    <NumberStepper
                        display={true}
                        value={chordShapeFilters.fretSpan}
                        incrementFn={() => incrementFretSpan(1)}
                        decrementFn={() => incrementFretSpan(-1)}
                        lowerBound={MINIMUM_FRET_SPAN}
                        upperBound={MAXIMUM_FRET_SPAN}
                        buttonStyles={stepperButtonStyles}
                        displayStyles={displayStyles}
                        variant={"subtle"}
                    />
                    <legend className={legendStyles}>
                        Fret span
                    </legend>
                </div>
                <div className={fieldsetStyles}>
                    <NumberStepper
                        display={true}
                        value={chordShapeFilters.fingers}
                        incrementFn={() => incrementFingers(1)}
                        decrementFn={() => incrementFingers(-1)}
                        lowerBound={MINIMUM_FINGERS}
                        upperBound={MAXIMUM_FINGERS}
                        buttonStyles={stepperButtonStyles}
                        displayStyles={displayStyles}
                        variant={"subtle"}
                    />
                    <legend className={legendStyles}>
                        Fingers
                    </legend>
                </div>
                <div className={fieldsetStyles}>
                    <NumberStepper
                        display={true}
                        value={chordShapeFilters.lowFret}
                        incrementFn={() => incrementLowFret(1)}
                        decrementFn={() => incrementLowFret(-1)}
                        lowerBound={0}
                        upperBound={tuningContext.tuning.fretCount}
                        buttonStyles={stepperButtonStyles}
                        displayStyles={displayStyles}
                        variant={"subtle"}
                    />
                    <legend className={legendStyles}>
                        Low fret
                    </legend>
                </div>
                <div className={fieldsetStyles}>
                    <NumberStepper
                        display={true}
                        value={chordShapeFilters.highFret}
                        incrementFn={() => incrementHighFret(1)}
                        decrementFn={() => incrementHighFret(-1)}
                        lowerBound={0}
                        upperBound={tuningContext.tuning.fretCount}
                        buttonStyles={stepperButtonStyles}
                        displayStyles={displayStyles}
                        variant={"subtle"}
                    />
                    <legend className={legendStyles}>
                        High fret
                    </legend>
                </div>
                <div className={fieldsetStyles}>
                    <BinaryToggle
                        state={filterSavedShapes}
                        fn={(state) => setFilterSavedShapes(state)}
                    />
                    <legend className={legendStyles}>
                        <div className={`flex gap-2 items-center`}>
                            Filter saved shapes
                            <Tooltip text={"Only show saved shapes that meet these requirements"}/>
                        </div>
                    </legend>
                </div>
                <div className={fieldsetStyles}>
                    <BinaryToggle
                        state={fitSavedShapes}
                        fn={(state) => setFitSavedShapes(state)}
                    />
                    <legend className={legendStyles}>
                        <div className={`flex gap-2 items-center`}>
                            Transpose saved shapes
                            <Tooltip text={"Where possible, transpose shapes that were saved on a different root note"}/>
                        </div>
                    </legend>
                </div>
            </div>
        </div>
    )
}