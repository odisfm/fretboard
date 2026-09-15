import {db} from "@fretboard/shared/db"
import {TuningSchema} from "@fretboard/shared/types/tuning";
import type {TuningResponse} from "@fretboard/shared/types/apiResponses";
import {createHono} from "../helpers/createHono";
import {needsAuth} from "../middleware/needsAuth";

export const tuningRouter = createHono()

tuningRouter.post("/", needsAuth, async (c) => {
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
                userId: c.get("user")!.id,
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

tuningRouter.patch("/", needsAuth, async (c) => {
    const body = await c.req.json()
    let tuning;
    try {
        tuning = TuningSchema.parse(body)
    } catch (e) {
        console.log(e)
        return c.json({error: "Malformed input"}, 400)
    }
    try {
        const update = await db.tuning.upsert({
            where: {
                id: tuning.id,
                userId: c.get("user")!.id
            },
            create: {
                id: tuning.id,
                userId: c.get("user")!.id,
                data: tuning,
                updatedAt: new Date(),
            },
            update: {
                data: tuning,
                updatedAt: new Date()
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

tuningRouter.delete("/:id", needsAuth, async (c) => {
    const id = c.req.param("id")
    try {
        const record = await db.tuning.delete({
            where: {
                id,
                userId: c.get("user")!.id,
            }
        })
        return c.json({message: `Deleted tuning ${id}`}, 200)
    } catch (e) {
        console.error(e)
        return c.json({error: "Internal server error"}) // todo:
    }
})
