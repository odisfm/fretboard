import type {ScaleShape} from "@fretboard/shared/src/types/scale.ts";

export type SortScaleShapesStrategy = "lowToHighFretToString"

export function sortScaleShapes(scaleShapes: ScaleShape[], strategy: SortScaleShapesStrategy): ScaleShape[] {
    switch (strategy) {
        case "lowToHighFretToString":
            return sortLowToHighFretToString(scaleShapes);
    }
}

function sortLowToHighFretToString(scaleShapes: ScaleShape[]): ScaleShape[] {
    return scaleShapes.sort((a, b) => {
        const aLength = a.shape.length
        const bLength = b.shape.length
        const shortestShape = Math.min(aLength, bLength)
        for (let i = 0; i < shortestShape - 1; i++) {
            const posA = a.shape[i];
            const posB = b.shape[i];
            if (posA.stringIndex < posB.stringIndex) {
                return -1
            } else if (posB.stringIndex < posA.stringIndex) {
                return 1
            }

            if (posA.fret < posB.fret) {
                return -1
            } else if (posA.fret > posB.fret) {
                return 1
            }
        }
        if (aLength === bLength) {
            return 0
        } else if (aLength < bLength) {
            return -1
        } else {
            return 1
        }
    })
}
