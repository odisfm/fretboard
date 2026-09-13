import { Hono } from 'hono'
import { db } from "@fretboard/shared/db"

export const testUserDataRouter = new Hono()

testUserDataRouter.get("/:userId", async (c) => {
    const userId = c.req.param("userId")
    const userRecord = await db.user.findUnique({
        where: {id: userId},
        include: {
            scales: true,
            tunings: true,
            shapes: true
        }
    })
    if (!userRecord) {
        return c.json({error: 'User not found'}, 404)
    }

    const scales = userRecord.scales.map((s) => {
        const data = s.data
        return {...data as object}
    })
    const tunings = userRecord.tunings.map((s) => {
        const data = s.data
        return {...data as object}
    })

    return c.json({scales, tunings, shapes: []}, 200)


})