import {test, expect, describe} from "vitest"
import {eStandardTuning, type Tuning} from "@fretboard/shared/types/tuning";
import type {Scale, ScaleShape} from "@fretboard/shared/types/scale";
import {generateScaleShapes} from "./generateScaleShapes";
import {midiPitchToNoteName} from "@fretboard/shared/utils/midiPitchToNoteName";
import { v4 as createUuid } from "uuid"

function simplifySingleStringShape(shape: ScaleShape): number[] {
    return shape.shape.map(pos => {
        return pos.fret
    })
}

function isShapeInShapes(searchShape: ScaleShape, arrayShapes: ScaleShape[]): boolean {
    for (const aShape of arrayShapes) {
        if (isSameShape(aShape, searchShape)) {
            return true;
        }
    }
    return false;
}

function isSameShape(shapeA: ScaleShape, shapeB: ScaleShape): boolean {
    if (shapeA.shape.length !== shapeB.shape.length) {
        return false;
    }
    for (let i = 0; i < shapeA.shape.length; i++) {
        const posA = shapeA.shape[i];
        const posB = shapeB.shape[i];
        if (
            posA.fret !== posB.fret ||
            posA.scaleIndex !== posB.scaleIndex ||
            posA.stringIndex !== posB.stringIndex
        ) {
            return false;
        }
    }

    return true;
}

function shapeHasAllNotes(shape: ScaleShape): boolean {
    const noteNames: Set<string> = new Set();
    for (const p of shape.shape) {
        const name = midiPitchToNoteName(shape.tuning.strings[p.stringIndex] + p.fret, false)
        noteNames.add(name)
    }

    return noteNames.size === shape.scale.intervals.length
}

describe("single-string tests", () => {
    test("G major", () => {
        const tuning: Tuning = {
            capo: [0], fretCount: 24, strings: [40], id: createUuid()
        }
        const scale: Scale = {
            intervals: [2, 2, 1, 2, 2, 2, 1], name: "G Major", tonic: "G", id: createUuid()
        }

        const result = generateScaleShapes(
            tuning,
            scale,
            { minOctaves: 0, minPerString: 1 }
        )

        const simplified: number[][] = result.map(s => simplifySingleStringShape(s))

        expect(simplified).toEqual([
            [3],
            [3, 5],
            [3, 5, 7],
            [15],
            [15, 17],
            [15, 17, 19]
        ])

    })

    test("G minor", () => {
        const tuning: Tuning = {
            capo: [0], fretCount: 24, strings: [40], id: createUuid()
        }
        const scale: Scale = {
            intervals: [2, 1, 2, 2, 1, 2, 2], name: "G Minor", tonic: "G", id: createUuid()
        }

        const result = generateScaleShapes(
            tuning,
            scale,
            { minOctaves: 0, minPerString: 1 }
        )

        const simplified: number[][] = result.map(s => simplifySingleStringShape(s))

        expect(simplified).toEqual([
            [3],
            [3, 5],
            [3, 5, 6],
            [15],
            [15, 17],
            [15, 17, 18]
        ])

    })
})

describe("multi-string tests", () => {
    test("Classic G Major", () => {
        const tuning = eStandardTuning
        const scale: Scale = {
            intervals: [2, 2, 1, 2, 2, 2, 1], name: "G Major", tonic: "G", id: createUuid()
        }

        const results = generateScaleShapes(tuning, scale)

        const searchShape: ScaleShape = {
            highFret: 5, lowFret: 2, id: createUuid(), shape: [
                {
                    stringIndex: 0,
                    fret: 3,
                    scaleIndex: 0
                },
                {
                    stringIndex: 0,
                    fret: 5,
                    scaleIndex: 1
                },
                {
                    stringIndex: 1,
                    fret: 2,
                    scaleIndex: 2
                },
                {
                    stringIndex: 1,
                    fret: 3,
                    scaleIndex: 3
                },
                {
                    stringIndex: 1,
                    fret: 5,
                    scaleIndex: 4
                },
                {
                    stringIndex: 2,
                    fret: 2,
                    scaleIndex: 5
                },
                {
                    stringIndex: 2,
                    fret: 4,
                    scaleIndex: 6
                },
                {
                    stringIndex: 2,
                    fret: 5,
                    scaleIndex: 0
                },
                {
                    stringIndex: 3,
                    fret: 2,
                    scaleIndex: 1
                },
                {
                    stringIndex: 3,
                    fret: 4,
                    scaleIndex: 2
                },
                {
                    stringIndex: 3,
                    fret: 5,
                    scaleIndex: 3
                },
                {
                    stringIndex: 4,
                    fret: 3,
                    scaleIndex: 4
                },
                {
                    stringIndex: 4,
                    fret: 5,
                    scaleIndex: 5
                },
                {
                    stringIndex: 5,
                    fret: 2,
                    scaleIndex: 6
                },
                {
                    stringIndex: 5,
                    fret: 3,
                    scaleIndex: 0
                },
                {
                    stringIndex: 5,
                    fret: 5,
                    scaleIndex: 1
                }

            ],
            tuning,
            scale
        }

        expect(isShapeInShapes(searchShape, results)).toEqual(true)

        for (const s of results) {
            expect(shapeHasAllNotes(s)).toEqual(true)
        }

    })
    test("Classic E Minor", () => {
        const tuning = eStandardTuning
        const scale: Scale = {
            intervals: [2, 1, 2, 2, 1, 2, 2], name: "E Minor", tonic: "E", id: createUuid()
        }

        const results = generateScaleShapes(tuning, scale)

        const searchShape: ScaleShape = {
            lowFret: 12, highFret: 16, tuning, scale, id: createUuid(), shape: [
                {
                    stringIndex: 0,
                    fret: 12,
                    scaleIndex: 0
                },
                {
                    stringIndex: 0,
                    fret: 14,
                    scaleIndex: 1
                },
                {
                    stringIndex: 0,
                    fret: 15,
                    scaleIndex: 2
                },
                {
                    stringIndex: 1,
                    fret: 12,
                    scaleIndex: 3
                },
                {
                    stringIndex: 1,
                    fret: 14,
                    scaleIndex: 4
                },
                {
                    stringIndex: 1,
                    fret: 15,
                    scaleIndex: 5
                },
                {
                    stringIndex: 2,
                    fret: 12,
                    scaleIndex: 6
                },
                {
                    stringIndex: 2,
                    fret: 14,
                    scaleIndex: 0,
                },
                {
                    stringIndex: 2,
                    fret: 16,
                    scaleIndex: 1
                },
                {
                    stringIndex: 3,
                    fret: 12,
                    scaleIndex: 2
                },
                {
                    stringIndex: 3,
                    fret: 14,
                    scaleIndex: 3
                },
                {
                    stringIndex: 4,
                    fret: 12,
                    scaleIndex: 4
                },
                {
                    stringIndex: 4,
                    fret: 13,
                    scaleIndex: 5
                },
                {
                    stringIndex: 4,
                    fret: 15,
                    scaleIndex: 6
                },
                {
                    stringIndex: 5,
                    fret: 12,
                    scaleIndex: 0
                },
                {
                    stringIndex: 5,
                    fret: 14,
                    scaleIndex: 1
                },
                {
                    stringIndex: 5,
                    fret: 15,
                    scaleIndex: 2
                }
            ]
        }

        expect(isShapeInShapes(searchShape, results)).toBe(true)

        for (const s of results) {
            expect(shapeHasAllNotes(s)).toEqual(true)
        }
    })
})