import { describe, test, expect } from "vitest";
import {midiPitchToNoteName} from "./midiPitchToNoteName";

describe("midiPitchToNoteName()", () => {
    test("valid inputs", () => {
        expect(
            midiPitchToNoteName(
                0
            )
        ).toEqual("C-1")

        expect(
            midiPitchToNoteName(
                36
            )
        ).toEqual("C2")

        expect(
            midiPitchToNoteName(
                37
            )
        ).toEqual("C#2")

        expect(
            midiPitchToNoteName(
                37,
                true,
                "flats"
            )
        ).toEqual("Db2")

        expect(
            midiPitchToNoteName(
                60,
                false
            )
        ).toEqual("C")
    })

    test("invalid inputs", () => {
        expect(() => {
            midiPitchToNoteName(
                3.14
            )
        }).toThrow()

        expect(() => {
            midiPitchToNoteName(
                -1
            )
        }).toThrow()

        expect(() => {
            midiPitchToNoteName(
                1000
            )
        }).toThrow()
    })
})