import * as z from "zod"
import {TuningSchema} from "./tuning";
import {NoteNameSchema} from "./scale";

export const ChordSchema = z.object({
    id: z.uuidv4(),
    quality: z.string(),
    intervals: z.array(z.number()),
    root: NoteNameSchema
})

export type Chord = z.infer<typeof ChordSchema>;

/** Fretting hand only: 1 = index, 2 = middle, 3 = ring, 4 = pinky.
 *  The thumb-over-the-top grip isn't modelled. */
export const FingerSchema = z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
])

export type Finger = z.infer<typeof FingerSchema>;

export const ChordPositionSchema = z.object({
    stringIndex: z.number(),
    fret: z.number(),
    /** Absent on open strings, and on shapes that haven't been fingered yet.
     *  Positions covered by the same barre share a finger. */
    finger: FingerSchema.optional(),
    toneIndex: z.number(),
})

export type ChordPosition = z.infer<typeof ChordPositionSchema>;

/** One finger laid flat across `fret`, covering `fromString`..`toString` inclusive.
 *
 *  The span is stored rather than derived, because the finger lies across
 *  strings it isn't sounding: in an E-shape barre only the outer strings carry
 *  finger 1, and the renderer still has to draw the bar through the middle. */
export const BarreSchema = z.object({
    finger: FingerSchema,
    fret: z.number(),
    fromString: z.number(),
    toString: z.number(),
})

export type Barre = z.infer<typeof BarreSchema>;

export const ChordShapeSchema = z.object({
    id: z.uuidv4(),
    tuning: TuningSchema,
    chord: ChordSchema,
    shape: z.array(ChordPositionSchema),
    /** Array rather than a single barre so a second one (ring-finger double
     *  stop) doesn't need a migration later. The generator emits at most one. */
    barres: z.array(BarreSchema),
    lowFret: z.number(),
    highFret: z.number(),
    order: z.string().optional(),
    isAdjusted: z.boolean().optional(),
    updatedAt: z.coerce.date().optional(),
})

export type ChordShape = z.infer<typeof ChordShapeSchema>;
