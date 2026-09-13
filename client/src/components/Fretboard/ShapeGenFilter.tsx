import {NumberStepper} from "../generic/NumberStepper.tsx";
import type {GenerateScaleShapesOptions} from "../../formulas/generateScaleShapes.ts";
import {BinaryToggle} from "../generic/BinaryToggle.tsx";

type Props = {
    shapeGenOptions: GenerateScaleShapesOptions
    setShapeGenOptions: (o: GenerateScaleShapesOptions) => void;
    fretboardZoom: number
    setFretboardZoom: (val: number) => void;
    filterSavedShapes: boolean,
    setFilterSavedShapes: (bool: boolean) => void,
    fitSavedShapes: boolean,
    setFitSavedShapes: (bool: boolean) => void,
}

const MIN_OCTAVE_BOUNDS = [1, 4]
const MIN_PER_STRING_BOUNDS = [0, 4]
const MAX_PER_STRING_BOUNDS = [1, 5]
const MAX_FRET_SPAN_BOUNDS = [2, 8]

export function ShapeGenFilter(
    {
        shapeGenOptions, setShapeGenOptions, fretboardZoom,
        setFretboardZoom, filterSavedShapes, setFilterSavedShapes,
        fitSavedShapes, setFitSavedShapes
    }: Props) {

    function incrementMinOctaves(inc: number) {
        const current = shapeGenOptions.minOctaves!
        const newValue = current + inc
        if (newValue < MIN_OCTAVE_BOUNDS[0] || newValue > MIN_OCTAVE_BOUNDS[1]) {
            return
        }
        setShapeGenOptions({
            ...shapeGenOptions,
            minOctaves: newValue,
        })
    }

    function incrementMinPerString(inc: number) {
        const current = shapeGenOptions.minPerString!
        const newValue = current + inc
        if (newValue < MIN_PER_STRING_BOUNDS[0] || newValue > MIN_PER_STRING_BOUNDS[1]) {
            return
        }
        setShapeGenOptions({
            ...shapeGenOptions,
            minPerString: newValue,
        })
    }

    function incrementMaxPerString(inc: number) {
        const current = shapeGenOptions.maxPerString!
        const newValue = current + inc
        if (newValue < MAX_PER_STRING_BOUNDS[0] || newValue > MAX_PER_STRING_BOUNDS[1]) {
            return
        }
        setShapeGenOptions({
            ...shapeGenOptions,
            maxPerString: newValue,
        })
    }

    function incrementMaxFretSpan(inc: number) {
        const current = shapeGenOptions.maxFretSpan!
        const newValue = current + inc
        if (newValue < MAX_FRET_SPAN_BOUNDS[0] || newValue > MAX_FRET_SPAN_BOUNDS[1]) {
            return
        }
        setShapeGenOptions({
            ...shapeGenOptions,
            maxFretSpan: newValue,
        })
    }

    function incrementFretboardZoom(direction: -1 | 1) {
        const step = .1
        const val = step * direction
        setFretboardZoom(fretboardZoom + val)
    }

    const displayStyles = `bg-neutral-800`
    const legendStyles = `text-sm text-white/80 max-w-20`
    const containerStyles = `flex flex-col gap-3`

    return (
        <div className={`flex flex-wrap gap-2 p-4 rounded-md bg-neutral-950`}>
            <div className={containerStyles}>
                <NumberStepper
                    display={true}
                    value={shapeGenOptions.minOctaves!}
                    incrementFn={() => incrementMinOctaves(1)}
                    decrementFn={() => incrementMinOctaves(-1)}
                    variant={"subtle"}
                    lowerBound={MIN_OCTAVE_BOUNDS[0]}
                    upperBound={MIN_OCTAVE_BOUNDS[1]}
                    displayStyles={displayStyles}
                />
                <legend className={legendStyles}>Minimum octaves</legend>
            </div>
            <div className={containerStyles}>
                <NumberStepper
                    display={true}
                    value={shapeGenOptions.minPerString!}
                    incrementFn={() => incrementMinPerString(1)}
                    decrementFn={() => incrementMinPerString(-1)}
                    variant={"subtle"}
                    lowerBound={MIN_PER_STRING_BOUNDS[0]}
                    upperBound={MIN_PER_STRING_BOUNDS[1]}
                    displayStyles={displayStyles}
                />
                <legend className={legendStyles}>Minimum notes per string</legend>
            </div>
            <div className={containerStyles}>
                <NumberStepper
                    display={true}
                    value={shapeGenOptions.maxPerString!}
                    incrementFn={() => incrementMaxPerString(1)}
                    decrementFn={() => incrementMaxPerString(-1)}
                    variant={"subtle"}
                    lowerBound={MAX_PER_STRING_BOUNDS[0]}
                    upperBound={MAX_PER_STRING_BOUNDS[1]}
                    displayStyles={displayStyles}
                />
                <legend className={legendStyles}>Maximum notes per string</legend>
            </div>
            <div className={containerStyles}>
                <NumberStepper
                    display={true}
                    value={shapeGenOptions.maxFretSpan!}
                    incrementFn={() => incrementMaxFretSpan(1)}
                    decrementFn={() => incrementMaxFretSpan(-1)}
                    variant={"subtle"}
                    lowerBound={MAX_FRET_SPAN_BOUNDS[0]}
                    upperBound={MAX_FRET_SPAN_BOUNDS[1]}
                    displayStyles={displayStyles}
                />
                <legend className={legendStyles}>Maximum fret span</legend>
            </div>
            <div className={containerStyles}>
                <NumberStepper
                    display={true}
                    value={fretboardZoom}
                    incrementFn={() => incrementFretboardZoom(1)}
                    decrementFn={() => incrementFretboardZoom(-1)}
                    variant={"subtle"}
                    lowerBound={1}
                    upperBound={2}
                    displayStyles={displayStyles}
                    valueDisplayFn={(value): string => {
                        const num = value as number;
                        return num.toFixed(1)
                    }}
                />
                <legend className={legendStyles}>Fretboard zoom</legend>
            </div>
            <div className={containerStyles}>
                <BinaryToggle state={filterSavedShapes} fn={(newState) => setFilterSavedShapes(newState)}/>
                <legend className={legendStyles}>Filter saved shapes</legend>
            </div>
            <div className={containerStyles}>
                <BinaryToggle state={fitSavedShapes} fn={(newState) => setFitSavedShapes(newState)}/>
                <legend className={legendStyles}>Transpose saved shapes</legend>
            </div>
        </div>
    )
}