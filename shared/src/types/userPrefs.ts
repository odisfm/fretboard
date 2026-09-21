import * as z from "zod"
import {SortScaleShapesStrategySchema} from "@fretboard/client/src/formulas/scaleShapes/sortScaleShapes";

export const AccidentalPrefSchema = z.union(
    [z.null(), z.literal("sharps"), z.literal("flats")]
)
export type AccidentalPrefType = z.infer<typeof AccidentalPrefSchema>

export const NoteLabelPrefScaleSchema = z.union(
    [z.literal("note"), z.literal("nashville"), z.literal("interval")]
)
export type NoteLabelPrefScale = z.infer<typeof NoteLabelPrefScaleSchema>

export const NoteLabelPrefChordSchema = z.union(
    [z.literal("finger"),  z.literal("note"), z.literal("interval")]
)

export type NoteLabelPrefChord = z.infer<typeof NoteLabelPrefChordSchema>

export const MINIMUM_FRETBOARD_ZOOM = 1.0
export const MAXIMUM_FRETBOARD_ZOOM = 2.0
export const MINIMUM_OUT_SHAPE_OPACITY = 0.0
export const MAXIMUM_OUT_SHAPE_OPACITY = 1.0

export const UserPrefSchema = z.object({
    updatedAt: z.coerce.date(),
    accidental: AccidentalPrefSchema,
    noteLabelScale: NoteLabelPrefScaleSchema,
    noteLabelChord: NoteLabelPrefChordSchema,
    tuningId: z.uuidv4().optional(),
    fretboardZoom: z.number().min(MINIMUM_FRETBOARD_ZOOM).max(MAXIMUM_FRETBOARD_ZOOM),
    scaleOutOpacity: z.number().min(MINIMUM_OUT_SHAPE_OPACITY).max(MAXIMUM_OUT_SHAPE_OPACITY),
    chordOutOpacity: z.number().min(MINIMUM_OUT_SHAPE_OPACITY).max(MAXIMUM_OUT_SHAPE_OPACITY),
    scaleGen: z.object({
        sortBy: SortScaleShapesStrategySchema,
        filterSaved: z.boolean(),
        transposeSaved: z.boolean(),
    }),
    moduleVisibility: z.object({
        tuning: z.boolean(),
        scale: z.boolean(),
        chord: z.boolean(),
    }),
    fretboardRotation: z.union([z.literal("horizontal"), z.literal("vertical")])
})

export type UserPrefType = z.infer<typeof UserPrefSchema>


export const defaultUserPrefs: UserPrefType = {
    updatedAt: new Date("1970-01-01"),
    accidental: null,
    noteLabelScale: "note",
    noteLabelChord: "note",
    tuningId: undefined,
    fretboardZoom: 1.5,
    scaleOutOpacity: 0.3,
    chordOutOpacity: 0.3,
    scaleGen: {
        sortBy: "lowToHighFretToString",
        filterSaved: false,
        transposeSaved: true
    },
    moduleVisibility: {
      tuning: true,
      scale: true,
      chord: true,
    },
    fretboardRotation: "horizontal"
}

