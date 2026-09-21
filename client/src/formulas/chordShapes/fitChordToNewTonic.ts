import type {NoteName} from "@fretboard/shared/types/scale";
import type {ChordShape} from "@fretboard/shared/types/chord"
import {indexForNoteName} from "@fretboard/shared/utils/indexForNoteName";

function mod12(n: number): number {
    return ((n % 12) + 12) % 12;
}

// assumes the chord quality and tuning are matching
export function fitChordShapeToNewTonic(shape: ChordShape, newRoot: NoteName): ChordShape | null {
    const oldTonicIndex = indexForNoteName(shape.chord.root)
    const newTonicIndex = indexForNoteName(newRoot)
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


    const newShape: ChordShape = {
        id: shape.id,
        tuning: shape.tuning,
        isAdjusted: true,
        chord: {
            ...shape.chord,
            root: newRoot
        },
        lowFret: shape.lowFret + increment,
        highFret: shape.highFret + increment,
        shape: shape.shape.map((p) => {
            return {...p, fret: p.fret + increment}
        }),
        barres: shape.barres.map((b) => {
            return {...b, fret: b.fret + increment}
        })
    }

    return newShape
}
