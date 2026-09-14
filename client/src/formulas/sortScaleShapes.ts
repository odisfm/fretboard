import type {ScaleShape} from "@fretboard/shared/types/scale";

type SortScaleShapesStrategyOption = {
    displayName: string;
    strategy: SortScaleShapesStrategy
}

export type SortScaleShapesStrategy =
    "lowToHighFretToString" | "lowToHighStringToFret" | "mostNotes"

export const sortScaleShapesStrategies: SortScaleShapesStrategyOption[] = [
    {displayName: "Lowest fret", strategy: "lowToHighFretToString"},
    {displayName: "Lowest string", strategy: "lowToHighStringToFret"},
    {displayName: "Most notes", strategy: "mostNotes"}
]

export function sortScaleShapes(scaleShapes: ScaleShape[], strategy: SortScaleShapesStrategy): ScaleShape[] {
    switch (strategy) {
        case "lowToHighFretToString":
            return sortLowToHighFretToString(scaleShapes);
        case "lowToHighStringToFret":
            return sortLowToHighStringToFret(scaleShapes)
        case "mostNotes":
            return sortMostToLeastNotes(scaleShapes)
    }
}

function sortLowToHighStringToFret(scaleShapes: ScaleShape[]): ScaleShape[] {
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

function sortLowToHighFretToString(scaleShapes: ScaleShape[]): ScaleShape[] {
    return scaleShapes.sort((a, b) => {
        const aLength = a.shape.length
        const bLength = b.shape.length
        if (a.shape[0].stringIndex === b.shape[0].stringIndex && a.shape[0].fret === b.shape[0].fret) {
            if (a.lowFret < b.lowFret) {
                return -1
            } else if (a.lowFret > b.lowFret) {
                return 1
            }
        }
        const shortestShape = Math.min(aLength, bLength)
        for (let i = 0; i < shortestShape - 1; i++) {
            const posA = a.shape[i];
            const posB = b.shape[i];
            if (posA.fret < posB.fret) {
                return -1
            } else if (posA.fret > posB.fret) {
                return 1
            }

            if (posA.stringIndex < posB.stringIndex) {
                return -1
            } else if (posB.stringIndex < posA.stringIndex) {
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

function sortMostToLeastNotes(scaleShapes: ScaleShape[]): ScaleShape[] {
    scaleShapes = sortLowToHighStringToFret(scaleShapes);
    return scaleShapes.sort((a, b) => {
        if (a.shape.length > b.shape.length) {
            return -1
        } else if (a.shape.length < b.shape.length) {
            return 1
        }
        return 0
    })
}
