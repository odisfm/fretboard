import {describe, test, expect} from "vitest";
import {indexForNoteName} from "./indexForNoteName";

describe("indexForNoteName()", () => {
    test("valid input", () => {
        expect(indexForNoteName("C")).toEqual(0)
        expect(indexForNoteName("B")).toEqual(11)
        expect(indexForNoteName("Db")).toEqual(1)
    })
})
