import {ScaleSchema, ScaleShapeSchema} from "@fretboard/shared/types/scale";
import {sortByLexorank} from "@fretboard/shared/utils/sortByLexorank";
import {TuningSchema} from "@fretboard/shared/types/tuning";
import type {UserGetPayload} from "@fretboard/shared/prisma/models/User";
import {ChordSchema, ChordShapeSchema} from "@fretboard/shared/types/chord";

type UserRecord = UserGetPayload<{
    include: {scales: true, scaleShapes: true, tunings: true, chords: true, chordShapes: true}
}>

export function formatBulkUserData(userRecord: UserRecord) {
    let scales = userRecord.scales.map((s) => {
        const obj = {
            ...s.data as object,
            id: s.id,
            updatedAt: s.updatedAt,
        }
        return ScaleSchema.parse(obj)
    })
    scales = scales.sort((a, b) => {
        return sortByLexorank(a, b)
    })

    let tunings = userRecord.tunings.map((t) => {
        const obj = {
            ...t.data as object,
            id: t.id,
            updatedAt: t.updatedAt,
        }
        return TuningSchema.parse(obj)
    })
    tunings = tunings.sort((a, b) => {
        return sortByLexorank(a, b)
    })

    let scaleShapes = userRecord.scaleShapes.map((s) => {
        const obj = {
            ...s.data as object,
            id: s.id,
            updatedAt: s.updatedAt,
        }
        return ScaleShapeSchema.parse(obj)
    })
    scaleShapes = scaleShapes.sort((a, b) => {
        return sortByLexorank(a, b)
    })

    let chords = userRecord.chords.map((s) => {
        const obj = {
            ...s.data as object,
            id: s.id,
            updatedAt: s.updatedAt,
        }
        return ChordSchema.parse(obj)
    })
    chords = chords.sort((a, b) => {
        return sortByLexorank(a, b)
    })

    let chordShapes = userRecord.chordShapes.map((s) => {
        const obj = {
            ...s.data as object,
            id: s.id,
            updatedAt: s.updatedAt,
        }
        return ChordShapeSchema.parse(obj)
    })
    chordShapes = chordShapes.sort((a, b) => {
        return sortByLexorank(a, b)
    })

    return {scales, scaleShapes, tunings, chords, chordShapes}
}