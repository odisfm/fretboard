import * as z from "zod"
import {TuningSchema} from "./tuning";
import {BarreSchema, ChordSchema, FingerSchema} from "./chord";
import {ScaleSchema} from "./scale";

export const FingerPositionSchema = z.object({
    stringIndex: z.number(),
    fret: z.number(),
    finger: FingerSchema.optional()
})

export type FingerPosition = z.infer<typeof FingerPositionSchema>

export const FingerShapeSchema = z.object({
    id: z.uuidv4(),
    tuning: TuningSchema,
    shape: z.array(FingerPositionSchema),
    lowFret: z.number(),
    highFret: z.number(),
    chord: ChordSchema.optional(),
    scale: ScaleSchema.optional(),
    order: z.string().optional(),
    isAdjusted: z.boolean().optional(),
    updatedAt: z.coerce.date().optional(),
    barres: z.array(BarreSchema).optional(),
})

export type FingerShape = z.infer<typeof FingerShapeSchema>;
