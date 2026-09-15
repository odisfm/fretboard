import {Hono} from "hono";
import {db} from "@fretboard/shared/db"
import {TuningSchema} from "@fretboard/shared/types/tuning";
import type {TuningResponse} from "@fretboard/shared/types/apiResponses";

export const tuningRouter = new Hono()

tuningRouter.post("/", async (c) => {
    const body = await c.req.json()
    let tuning;
    try {
        tuning = TuningSchema.parse(body)
    } catch (e) {
        console.error(e)
        return c.json({error: "Malformed input"}, 400)
    }
    try {
        const insert = await db.tuning.create({
            data: {
                userId: process.env.VITE_TEST_USER_ID!, // todo:
                data: {...tuning},
                id:  tuning.id
            }
        })
        const tuningData = TuningSchema.parse(insert.data)
        return c.json({tuning: tuningData} satisfies TuningResponse, 200)

    } catch (e) {
        console.error(e)
        return c.json({error: "Internal server error"}, 400)
    }
})

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
                updatedAt: new Date(),
            }
        })
        const tuningData =
            TuningSchema.parse({...update.data as object, updatedAt: update.updatedAt})
        return c.json({tuning: tuningData} satisfies TuningResponse, 200)
    } catch (e) {
        console.error(e)
        return c.json({error: "Internal server error"}, 500)
    }
})

tuningRouter.delete("/:id", async (c) => {
    const id = c.req.param("id")
    try {
        const record = await db.tuning.delete({
            where: {
                id,
                userId: process.env.VITE_TEST_USER_ID! // todo:
            }
        })
        return c.json({message: `Deleted tuning ${id}`}, 200)
    } catch (e) {
        console.error(e)
        return c.json({error: "Internal server error"}) // todo:
    }
})
