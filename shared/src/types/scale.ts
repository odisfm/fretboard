import * as z from "zod";
import {TuningSchema} from "./tuning.js"

export const NoteNameSchema = z.enum([
    "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb",
    "G", "G#", "Ab", "A", "A#", "Bb", "B",
]);

export type NoteName = z.infer<typeof NoteNameSchema>;

export const ScaleSchema = z.object({
    id: z.uuidv4(),
    tonic: NoteNameSchema,
    /** Difference between a degree and the previous degree,
     * starting from the second degree and ending with the return to the tonic */
    intervals: z.array(z.number()),
    name: z.string(),
    order: z.string(),
    updatedAt: z.coerce.date().optional(),
})

export type Scale = z.infer<typeof ScaleSchema>;

export const ScalePositionSchema = z.object({
    stringIndex: z.number(),
    fret: z.number(),
    /** Position in the scale, from 0-(n-1), where n is number of tones in scale.
     * Not a scale degree like b7. */
    scaleIndex: z.number(),
})

export type ScalePosition = z.infer<typeof ScalePositionSchema>;

export const ScaleShapeSchema = z.object({
    id: z.uuidv4(),
    scale: ScaleSchema,
    shape: z.array(ScalePositionSchema),
    tuning: TuningSchema,
    lowFret: z.number(),
    highFret: z.number(),
    order: z.string().optional(),
    isAdjusted: z.boolean().optional(),
    updatedAt: z.coerce.date().optional(),
})

export type ScaleShape = z.infer<typeof ScaleShapeSchema>;
