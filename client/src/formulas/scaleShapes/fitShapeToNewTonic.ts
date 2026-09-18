import type {NoteName, ScaleShape} from "@fretboard/shared/types/scale";
import {indexForNoteName} from "@fretboard/shared/utils/indexForNoteName";

function mod12(n: number): number {
    return ((n % 12) + 12) % 12;
}

// assumes the scale quality and tuning are matching
export function fitShapeToNewTonic(shape: ScaleShape, newTonic: NoteName): ScaleShape | null {
    const oldTonicIndex = indexForNoteName(shape.scale.tonic)
    const newTonicIndex = indexForNoteName(newTonic)
    if (oldTonicIndex === newTonicIndex) { return shape }

    const distanceUp = mod12(newTonicIndex - oldTonicIndex)
    const distanceDown = distanceUp === 0 ? 0 : 12 - distanceUp

    const fitsUp = shape.highFret + distanceUp <= shape.tuning.fretCount
    const fitsDown = shape.lowFret - distanceDown >= 0

    let increment: number
    if (distanceDown <= distanceUp && fitsDown) {
        increment = distanceDown * -1
    } else if (fitsUp) {
        increment = distanceUp
    } else if (fitsDown) {
        increment = distanceDown * -1
    } else {
        return null
    }

    const newShape: ScaleShape = {
        id: shape.id,
        tuning: shape.tuning,
        isAdjusted: true,
        scale: shape.scale,
        lowFret: shape.lowFret + increment,
        highFret: shape.highFret + increment,
        shape: shape.shape.map((p) => {
            return {...p, fret: p.fret + increment}
        })
    }

    return newShape
}
