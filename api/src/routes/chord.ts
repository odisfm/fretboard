import {db} from "@fretboard/shared";
import type {ChordResponse, ChordShapeResponse} from "@fretboard/shared/types/apiResponses";
import {createHono} from "../helpers/createHono";
import {needsAuth} from "../middleware/needsAuth";
import {ChordSchema} from "@fretboard/shared/types/chord";

export const chordRouter = createHono()

chordRouter.put("/", needsAuth, async (c) => {
    const body = await c.req.json()
    let chord
    try {
        chord = ChordSchema.parse(body)
    } catch (e) {
        console.error(e)
        return c.json({error: "Malformed input"}, 400)
    }
    let record
    try {
        record = await db.chord.create({
            data: {
                data: {...chord},
                userId: c.get("user")!.id,
                id: chord.id
            }
        })
    } catch (e) {
        console.error(e)
        return c.json({error: "Internal server error"}, 500)
    }
    const obj = ChordSchema.parse({
        ...record.data as object
    })

    return c.json({chord: obj} satisfies ChordResponse, 200)
})

chordRouter.delete("/", needsAuth, async (c) => {
    const body = await c.req.json()
    let chord
    try {
        chord = ChordSchema.parse(body)
    } catch (e) {
        console.error(e)
        return c.json({error: "Malformed input"}, 400)
    }
    let record
    try {
        record = await db.chord.delete({
            where: {id: chord.id, userId: c.get("user")!.id}
        })
        return c.json({}, 200)
    } catch (e) {
        console.error(e)
        return c.json({error: "Internal server error"}, 500)
    }
})
