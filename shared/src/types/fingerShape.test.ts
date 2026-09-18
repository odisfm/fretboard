import {test, expect} from "vitest";
import {type ScaleShape, ScaleShapeSchema} from "./scale";
import {eStandardTuning} from "./tuning";
import {type ChordShape, ChordShapeSchema} from "./chord";
import {FingerShapeSchema} from "./fingerShape";
import {v4 as createUuid} from "uuid";

test("ScaleShape and ChordShape both satisfy FingerShape", () => {
    const id = createUuid();
    const majorScaleShape: ScaleShape = {
        id: id,
        isAdjusted: undefined,
        lowFret: 2,
        highFret: 5,
        order: undefined,
        scale: {
            tonic: "G", name: "Major", intervals: [2, 2, 1, 2, 2, 2, 1], id: id, order: ""
        },
        shape: [
            {stringIndex: 0, fret: 3, scaleIndex: 0},
            {stringIndex: 0, fret: 5, scaleIndex: 1},
            {stringIndex: 1, fret: 2, scaleIndex: 2},
            {stringIndex: 1, fret: 3, scaleIndex: 3},
            {stringIndex: 1, fret: 5, scaleIndex: 3},
            {stringIndex: 2, fret: 2, scaleIndex: 4},
            {stringIndex: 2, fret: 4, scaleIndex: 5},
            {stringIndex: 2, fret: 5, scaleIndex: 6},

        ],
        tuning: eStandardTuning,
    }

    const barreChordShape: ChordShape = {
        id: id,
        chord: {root: "G", intervals: [4, 7], quality: "Major", id: id},
        lowFret: 3,
        highFret: 5,
        shape: [
            {stringIndex: 0, fret: 3, finger: 1, toneIndex: 0},
            {stringIndex: 1, fret: 5, finger: 3, toneIndex: 2},
            {stringIndex: 2, fret: 5, finger: 4, toneIndex: 0},
            {stringIndex: 3, fret: 4, finger: 2, toneIndex: 1},
            {stringIndex: 4, fret: 3, finger: 1, toneIndex: 2},
            {stringIndex: 5, fret: 3, finger: 1, toneIndex: 0},
        ],
        tuning: eStandardTuning,
        barres: [
            {
                finger: 1,
                fret: 3,
                fromString: 0,
                toString: 5
            }
        ]
    }

    FingerShapeSchema.parse(majorScaleShape);
    FingerShapeSchema.parse(barreChordShape);
    expect(ScaleShapeSchema.validate(majorScaleShape)).toBe(true)
    expect(FingerShapeSchema.validate(majorScaleShape)).toBe(true)
    expect(ChordShapeSchema.validate(barreChordShape)).toBe(true)
    expect(FingerShapeSchema.validate(barreChordShape)).toBe(true)
})