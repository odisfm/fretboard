import {createHono} from "../helpers/createHono";
import {needsAuth} from "../middleware/needsAuth";
import {UserPrefSchema} from "@fretboard/shared/types/userPrefs";
import {db} from "@fretboard/shared";

export const prefsRouter = createHono()

prefsRouter.patch("/", needsAuth, async (c) => {
    const userId = c.get("user")!.id
    let body
    try {
        body = UserPrefSchema.parse(await c.req.json())
    } catch (e) {
        console.error(e)
        return c.json({error: "Malformed data"}, 400)
    }
    try {
        const update = await db.user.update({
            where: {id: userId},
            data: {prefs: body}
        })
        return c.json({}, 200)
    } catch (e) {
        return c.json({error: "Internal server error"}, 500)
    }
})
