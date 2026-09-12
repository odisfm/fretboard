import {describe, test, expect} from "vitest";
import {allIndicesForNoteName} from "./allIndicesForNoteName";

describe("allIndicesForNoteName()", () => {
    test("valid input", () => {
        expect(allIndicesForNoteName("C")).toEqual(new Set([
            0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120
        ]))
        expect(allIndicesForNoteName("C#")).toEqual(new Set([
            1, 13, 25, 37, 49, 61, 73, 85, 97, 109, 121
        ]))
        expect(allIndicesForNoteName("G#")).toEqual(new Set([
            8, 20, 32, 44, 56, 68, 80, 92, 104, 116
        ]))

    })
})
