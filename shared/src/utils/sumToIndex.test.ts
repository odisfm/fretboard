import {expect, test} from "vitest";
import sumToIndex from "./sumToIndex.js";

test("sumToIndex", () => {
    expect(
        sumToIndex([1, 2, 3], 2)
    ).toEqual(6)

    expect(
        sumToIndex([1, 2, 3], 1)
    ).toEqual(3)

    expect(() => sumToIndex([1, 2, 3], 3)).toThrow()

    expect(() => sumToIndex([1], -1)).toThrow()
})
