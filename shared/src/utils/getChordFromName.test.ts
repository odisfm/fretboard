import {describe, test, expect} from "vitest";
import {getChordFromName} from "./getChordFromName";

 describe("getChordFromName", () => {
    test("valid input", () => {
        const r1 = getChordFromName("cmaj7")!
        expect(r1.root).toBe("C")
        expect(r1.intervals).toEqual([4, 7, 11])

        const r2 = getChordFromName("cmaj9")!
        expect(r2.root).toBe("C")
        expect(r2.intervals).toEqual([4, 7, 11, 14])
    })
})