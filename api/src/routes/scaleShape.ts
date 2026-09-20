import {ScaleShapeSchema} from "@fretboard/shared/types/scale";
import {db} from "@fretboard/shared";
import type {ScaleShapeResponse} from "@fretboard/shared/types/apiResponses";
import {createHono} from "../helpers/createHono";
import {needsAuth} from "../middleware/needsAuth";

export const scaleShapeRouter = createHono()

scaleShapeRouter.put("/", needsAuth, async (c) => {
    const body = await c.req.json()
    let shape
    try {
        shape = ScaleShapeSchema.parse(body)
    } catch (e) {
        console.error(e)
        return c.json({error: "Malformed input"}, 400)
    }
    let record
    try {
        record = await db.scaleShape.create({
            data: {
                data: {...shape},
                userId: c.get("user")!.id,
                id: shape.id
            }
        })
    } catch (e) {
        console.error(e)
        return c.json({error: "Internal server error"}, 500)
    }
    const obj = ScaleShapeSchema.parse({
        ...record.data as object
    })

    return c.json({scaleShape: obj} satisfies ScaleShapeResponse, 200)
})

scaleShapeRouter.delete("/", needsAuth, async (c) => {
    const body = await c.req.json()
    let shape
    try {
        shape = ScaleShapeSchema.parse(body)
    } catch (e) {
        console.error(e)
        return c.json({error: "Malformed input"}, 400)
    }
    let record
    try {
        record = await db.scaleShape.delete({
            where: {id: shape.id, userId: c.get("user")!.id}
        })
        return c.json({}, 200)
    } catch (e) {
        console.error(e)
        return c.json({error: "Internal server error"}, 500)
    }
})
