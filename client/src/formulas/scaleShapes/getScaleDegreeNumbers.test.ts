import {test, describe, expect} from "vitest";
import getScaleDegreeNumbers from "./getScaleDegreeNumbers.ts";

describe("getScaleDegreeNumbers", () => {
    test("natural minor scale", () => {
        expect(
            getScaleDegreeNumbers([2, 1, 2, 2, 1, 2, 2])
        ).toEqual([
            "1", "2", "b3", "4", "5", "b6", "b7"
        ])
    })

    test("harmonic minor scale", () => {
        expect(
            getScaleDegreeNumbers([2, 1, 2, 2, 1, 3, 1])
        ).toEqual([
            "1", "2", "b3", "4", "5", "b6", "7"
        ])
    })

    test("minor pentatonic scale", () => {
        expect(
            getScaleDegreeNumbers([3, 2, 2, 3, 2])
        ).toEqual([
            "1", "b3", "4", "5", "b7"
        ])
    })

    test("major pentatonic scale", () => {
        expect(
            getScaleDegreeNumbers([2, 2, 3, 2, 3])
        ).toEqual([
            "1", "2", "3", "5", "6"
        ])
    })

    test("lydian scale", () => {
        expect(
            getScaleDegreeNumbers([2, 2, 2, 1, 2, 2, 1])
        ).toEqual([
            "1", "2", "3", "#4", "5", "6", "7"
        ])
    })

    test("mixolydian scale", () => {
        expect(
            getScaleDegreeNumbers([2, 2, 1, 2, 2, 1, 2])
        ).toEqual([
            "1", "2", "3", "4", "5", "6", "b7"
        ])
    })

    test("locrian scale", () => {
        expect(
            getScaleDegreeNumbers([1, 2, 2, 1, 2, 2, 2])
        ).toEqual([
            "1", "b2", "b3", "4", "b5", "b6", "b7"
        ])
    })

    test("augmented scale", () => {
        expect(
            getScaleDegreeNumbers([3, 1, 3, 1, 3, 1])
        ).toEqual([
            "1", "b3", "3", "5", "#5", "7"
        ])
    })

    test("major blues scale", () => {
        expect(
            getScaleDegreeNumbers([2, 1, 1, 3, 2, 3])
        ).toEqual([
            "1", "2", "b3", "3", "5", "6"
        ])
    })

    test("minor blues scale", () => {
        expect(
            getScaleDegreeNumbers([3, 2, 1, 1, 3, 2])
        ).toEqual([
            "1", "b3", "4", "b5", "5", "b7"
        ])
    })

    test("diminished scale", () => {
        expect(
            getScaleDegreeNumbers([2, 1, 2, 1, 2, 1, 2, 1])
        ).toEqual([
            "1", "2", "b3", "4", "b5", "#5", "6", "7"
        ])
    })

    test("half-diminished bebop scale", () => {
        expect(
            getScaleDegreeNumbers([1, 2, 2, 1, 1, 1, 3, 1])
        ).toEqual([
            "1", "b2", "b3", "4", "b5", "5", "b6", "7"
        ])
    })

    test("chromatic scale", () => {
        expect(
            getScaleDegreeNumbers([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        ).toEqual([
            "1", "b2", "2", "b3", "3", "4", "b5", "5", "b6", "6", "b7", "7",
        ])
    })
})
