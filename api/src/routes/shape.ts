import {Hono} from "hono";
import {ScaleShapeSchema} from "@fretboard/shared/types/scale";
import {db} from "@fretboard/shared";
import type {ShapeResponse} from "@fretboard/shared/types/apiResponses";

export const shapeRouter = new Hono()

shapeRouter.put("/", async (c) => {
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
                userId: process.env.VITE_TEST_USER_ID!, // todo:
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

shapeRouter.delete("/", async (c) => {
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
            where: {id: shape.id}
        })
        return c.json({}, 200)
    } catch (e) {
        console.error(e)
        return c.json({error: "Internal server error"}, 500)
    }
})
