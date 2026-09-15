import {ScaleSchema, ScaleShapeSchema} from "@fretboard/shared/types/scale";
import {sortByLexorank} from "@fretboard/shared/utils/sortByLexorank";
import {TuningSchema} from "@fretboard/shared/types/tuning";
import type {UserGetPayload} from "@fretboard/shared/prisma/models/User";

type UserRecord = UserGetPayload<{
    include: {scales: true, shapes: true, tunings: true}
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

    let shapes = userRecord.shapes.map((s) => {
        const obj = {
            ...s.data as object,
            id: s.id,
            updatedAt: s.updatedAt,
        }
        return ScaleShapeSchema.parse(obj)
    })
    shapes = shapes.sort((a, b) => {
        return sortByLexorank(a, b)
    })

    return {scales, shapes, tunings}
}