import {db} from "@fretboard/shared";
import type {ChordShapeResponse} from "@fretboard/shared/types/apiResponses";
import {createHono} from "../helpers/createHono";
import {needsAuth} from "../middleware/needsAuth";
import {ChordShapeSchema} from "@fretboard/shared/types/chord";

export const chordShapeRouter = createHono()

chordShapeRouter.put("/", needsAuth, async (c) => {
    const body = await c.req.json()
    let shape
    try {
        shape = ChordShapeSchema.parse(body)
    } catch (e) {
        console.error(e)
        return c.json({error: "Malformed input"}, 400)
    }
    let record
    try {
        record = await db.chordShape.create({
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
    const obj = ChordShapeSchema.parse({
        ...record.data as object
    })

    return c.json({chordShape: obj} satisfies ChordShapeResponse, 200)
})

chordShapeRouter.delete("/", needsAuth, async (c) => {
    const body = await c.req.json()
    let shape
    try {
        shape = ChordShapeSchema.parse(body)
    } catch (e) {
        console.error(e)
        return c.json({error: "Malformed input"}, 400)
    }
    let record
    try {
        record = await db.chordShape.delete({
            where: {id: shape.id, userId: c.get("user")!.id}
        })
        return c.json({}, 200)
    } catch (e) {
        console.error(e)
        return c.json({error: "Internal server error"}, 500)
    }
})
