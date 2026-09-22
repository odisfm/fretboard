import {createHono} from "../helpers/createHono";
import {needsAuth} from "../middleware/needsAuth";
import {db} from "@fretboard/shared";
import {ScaleSchema} from "@fretboard/shared/types/scale";

export const scaleRouter = createHono()

scaleRouter.post("/", needsAuth, async (c) => {
    try {
        let body
        try {
            body = ScaleSchema.parse(c)
        } catch (e) {
            return c.json({error: "Malformed input"}, 400)
        }

        await db.scale.create({
            data: {
                data: body,
                userId: c.get("user")!.id
            }
        })

        return c.json({}, 200)

    } catch (e) {
        return c.json({error: "Internal server error"})
    }
})
