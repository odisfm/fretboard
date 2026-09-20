import {ScaleSchema, type ScaleShape, ScaleShapeSchema} from "./scale";
import {type Tuning, TuningSchema} from "./tuning";
import * as z from "zod";
import {type ChordShape, ChordShapeSchema} from "./chord";
import {UserPrefSchema} from "./userPrefs";

export const TestUserDataSchema = z.object({
    scales: z.array(ScaleSchema),
    tunings: z.array(TuningSchema),
    scaleShapes: z.array(ScaleShapeSchema),
    chordShapes: z.array(ChordShapeSchema),
    prefs: UserPrefSchema
})

export type TestUserDataResponse = z.infer<typeof TestUserDataSchema>;

export type TuningResponse = {
    tuning: Tuning
}

export type ScaleShapeResponse = {
    scaleShape: ScaleShape,
}

export type ChordShapeResponse = {
    chordShape: ChordShape,
}

export type RegistrationFailure = {
    error: {
        message: string,
        passwordConstraints?: string[],
        emailTaken?: true
    }
}
