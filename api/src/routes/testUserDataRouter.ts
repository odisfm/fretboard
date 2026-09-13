import { Hono } from 'hono'
import { db } from "@fretboard/shared/db"
import type {TestUserDataResponse} from "@fretboard/shared/types/apiResponses";
import {ScaleSchema} from "@fretboard/shared/types/scale";
import {TuningSchema} from "@fretboard/shared/types/tuning";
import {sortByLexorank} from "@fretboard/shared/utils/sortByLexorank";

export const testUserDataRouter = new Hono()

testUserDataRouter.get("/:userId", async (c) => {
    const userId = c.req.param("userId")
    const userRecord = await db.user.findUnique({
        where: {id: userId},
        include: {
            scales: {
                orderBy: [
                    {createdAt: "asc"}
                ]
            },
            tunings: {
                orderBy: [
                    {createdAt: "asc"}
                ]
            },
            shapes: {
                orderBy: [
                    {createdAt: "asc"}
                ]
            },
        }
    })
    if (!userRecord) {
        return c.json({error: 'User not found'}, 404)
    }

    let scales = userRecord.scales.map((s) => {
        const obj = {
            ...s.data as object,
            id: s.id,
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
        }
        return TuningSchema.parse(obj)
    })
    tunings = tunings.sort((a, b) => {
        return sortByLexorank(a, b)
    })

    console.log(tunings)

    return c.json({scales, tunings, shapes: []} satisfies TestUserDataResponse, 200)


})