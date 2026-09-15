import {ScaleShapeSchema} from "@fretboard/shared/types/scale";
import {db} from "@fretboard/shared";
import type {ShapeResponse} from "@fretboard/shared/types/apiResponses";
import {createHono} from "../helpers/createHono";
import {needsAuth} from "../middleware/needsAuth";

export const shapeRouter = createHono()

shapeRouter.put("/", needsAuth, async (c) => {
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
        record = await db.shape.create({
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

    return c.json({shape: obj} satisfies ShapeResponse, 200)
})

shapeRouter.delete("/", needsAuth, async (c) => {
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
        record = await db.shape.delete({
            where: {id: shape.id, userId: c.get("user")!.id}
        })
        return c.json({}, 200)
    } catch (e) {
        console.error(e)
        return c.json({error: "Internal server error"}, 500)
    }
})
