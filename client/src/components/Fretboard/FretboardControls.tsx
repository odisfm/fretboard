import {useUserData} from "../../contexts/userData/useUserData.tsx";
import {NumberStepper} from "../generic/NumberStepper.tsx";
import {
    MAXIMUM_FRETBOARD_ZOOM, MAXIMUM_OUT_SHAPE_OPACITY,
    MINIMUM_FRETBOARD_ZOOM,
    MINIMUM_OUT_SHAPE_OPACITY
} from "@fretboard/shared/types/userPrefs";
import {useFretboardDisplay} from "../../contexts/fretboardDisplay/useFretboardDisplay.tsx";
import {useMemo} from "react";
import Button from "../generic/Button.tsx";
import {FaRotate} from "react-icons/fa6";

const ZOOM_INCREMENT = 0.1
const OPACITY_INCREMENT = 0.1

const fieldsetClasses = `flex flex-col gap-1 justify-center items-center`
const legendClasses = `text-xs font-light block`

export function FretboardControls() {
    const userData = useUserData()
    const fdContext = useFretboardDisplay()

    function incrementFretboardZoom(increment: number) {
        const step = ZOOM_INCREMENT * increment
        let newValue = userData.prefs.fretboardZoom + step
        if (newValue > MAXIMUM_FRETBOARD_ZOOM) {
            newValue = MAXIMUM_FRETBOARD_ZOOM
        } else if (newValue < MINIMUM_FRETBOARD_ZOOM) {
            newValue = MINIMUM_FRETBOARD_ZOOM
        }
        userData.setPrefs({
            ...userData.prefs,
            fretboardZoom: newValue,
        })
    }

    function incrementOutShapeOpacity(increment: number) {
        const step = OPACITY_INCREMENT * increment
        const oldValue =
            fdContext.type === "scale" ? userData.prefs.scaleOutOpacity : userData.prefs.chordOutOpacity
        let newValue = oldValue + step
        if (newValue < MINIMUM_OUT_SHAPE_OPACITY) {
            newValue = MINIMUM_OUT_SHAPE_OPACITY
        } else if (newValue > MAXIMUM_OUT_SHAPE_OPACITY) {
            newValue = MAXIMUM_OUT_SHAPE_OPACITY
        }
        console.log(userData.prefs)
        console.log(step)
        if (fdContext.type === "scale") {
            userData.setPrefs({
                ...userData.prefs,
                scaleOutOpacity:  newValue,
            })
        } else if (fdContext.type === "chord") {
            userData.setPrefs({
                ...userData.prefs,
                chordOutOpacity: newValue,
            })
        }
    }

    const outShapeOpacity = useMemo(() => {
        if (fdContext.type === "scale") {
            return userData.prefs.scaleOutOpacity
        }
        if (fdContext.type === "chord") {
            return userData.prefs.chordOutOpacity
        }
        return 0
    }, [fdContext.type, userData.prefs.scaleOutOpacity, userData.prefs.chordOutOpacity])

    return (
        <div className={`flex gap-4 p-2 rounded-md bg-neutral-950`}>
            <div className={fieldsetClasses}>
                <legend className={legendClasses}>Rotate</legend>
                <Button onClick={() => {
                    if (userData.prefs.fretboardRotation === "vertical") {
                        userData.setPrefs({...userData.prefs, fretboardRotation: "horizontal"})
                    } else {
                        userData.setPrefs({...userData.prefs, fretboardRotation: "vertical"})
                }}}
                    >
                    <FaRotate />
                </Button>

            </div>
            <div className={fieldsetClasses}>
                <legend className={legendClasses}>Zoom</legend>
                <NumberStepper
                    display={true}
                    value={userData.prefs.fretboardZoom}
                    incrementFn={() => incrementFretboardZoom(1)}
                    decrementFn={() => incrementFretboardZoom(-1)}
                    variant={"subtle"}
                    lowerBound={MINIMUM_FRETBOARD_ZOOM}
                    upperBound={MAXIMUM_FRETBOARD_ZOOM}
                    displayStyles={``}
                    buttonStyles={``}
                    valueDisplayFn={(value): string => {
                        const num = value as number;
                        return num.toFixed(1)
                    }}
                />
            </div>
            <div className={fieldsetClasses}>
                <legend className={legendClasses}>Non-shape opacity</legend>
                <NumberStepper
                    display={true}
                    value={outShapeOpacity}
                    incrementFn={() => incrementOutShapeOpacity(1)}
                    decrementFn={() => incrementOutShapeOpacity(-1)}
                    variant={"subtle"}
                    lowerBound={MINIMUM_OUT_SHAPE_OPACITY}
                    upperBound={MAXIMUM_OUT_SHAPE_OPACITY}
                    displayStyles={``}
                    buttonStyles={``}
                    valueDisplayFn={(value): string => {
                        const num = value as number;
                        return num.toFixed(1)
                    }}
                />
            </div>
        </div>
    )
}