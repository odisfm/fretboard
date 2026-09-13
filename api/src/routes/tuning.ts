import {Hono} from "hono";
import {db} from "@fretboard/shared/db"
import {TuningSchema} from "@fretboard/shared/types/tuning";
import type {TuningResponse} from "@fretboard/shared/types/apiResponses";

export const tuningRouter = new Hono()

tuningRouter.patch("/", async (c) => {
    const body = await c.req.json()
    let tuning;
    try {
        tuning = TuningSchema.parse(body)
    } catch (e) {
        console.log(e)
        return c.json({error: "Malformed input"}, 400)
    }
    try {
        const update = await db.tuning.update({
            where: {
                id: tuning.id
            },
            data: {
                data: tuning,
            }
        })
        const tuningData = TuningSchema.parse(update.data)
        return c.json({tuning: tuningData} satisfies TuningResponse, 200)
    } catch (e) {
        console.error(e)
        return c.json({error: "Internal server error"}, 500)
    }
})
