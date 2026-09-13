import { Hono } from 'hono'
import { db } from "@fretboard/shared/db"
import type {TestUserDataResponse} from "@fretboard/shared/types/apiResponses";
import {ScaleSchema} from "@fretboard/shared/types/scale";
import {TuningSchema} from "@fretboard/shared/types/tuning";

export const testUserDataRouter = new Hono()

testUserDataRouter.get("/:userId", async (c) => {
    const userId = c.req.param("userId")
    const userRecord = await db.user.findUnique({
        where: {id: userId},
        include: {
            scales: {
                orderBy: {
                    order: "desc",
                    createdAt: "asc"
                }
            },
            tunings: {
                orderBy: {
                    order: "desc",
                    createdAt: "asc"
                }
            },
            shapes: {
                orderBy: {
                    order: "desc",
                    createdAt: "asc"
                }
            },
        }
    })
    if (!userRecord) {
        return c.json({error: 'User not found'}, 404)
    }

    const scales = userRecord.scales.map((s) => {
        const obj = {
            ...s.data as object,
            id: s.id,
        }
        return ScaleSchema.parse(obj)
    })
    const tunings = userRecord.tunings.map((t) => {
        const obj = {
            ...t.data as object,
            id: t.id,
        }
        return TuningSchema.parse(obj)
    })

    return c.json({scales, tunings, shapes: []} satisfies TestUserDataResponse, 200)


})