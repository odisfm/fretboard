import {describe, test, expect} from "vitest";
import {defaultUserPrefs, UserPrefSchema} from "./userPrefs";

describe("UserPrefType", () => {
    test("defaults validate", () => {
        expect(UserPrefSchema.validate(defaultUserPrefs)).toBe(true)
    })
})
