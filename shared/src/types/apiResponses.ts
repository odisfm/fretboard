import {ScaleSchema, type ScaleShape, ScaleShapeSchema} from "./scale";
import {type Tuning, TuningSchema} from "./tuning";
import * as z from "zod";

export const TestUserDataSchema = z.object({
    scales: z.array(ScaleSchema),
    tunings: z.array(TuningSchema),
    shapes: z.array(ScaleShapeSchema)
})

export type TestUserDataResponse = z.infer<typeof TestUserDataSchema>;

export type TuningResponse = {
    tuning: Tuning
}

export type ShapeResponse = {
    shape: ScaleShape,
}

export type RegistrationFailure = {
    error: {
        message: string,
        passwordConstraints?: string[],
        emailTaken?: true
    }
}
