import * as z from "zod"

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

