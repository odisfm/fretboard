import { cors } from "hono/cors"
import {testUserDataRouter} from "./routes/testUserDataRouter.js";
import {tuningRouter} from "./routes/tuning";
import {scaleShapeRouter} from "./routes/scaleShape";
import {createHono} from "./helpers/createHono";
import {deleteCookie, getCookie} from "hono/cookie";
import {db} from "@fretboard/shared";
import {authRouter} from "./routes/auth";
import {chordShapeRouter} from "./routes/chordShape";
import {prefsRouter} from "./routes/prefs";

export const app = createHono()

app.use(
    cors({
        origin: process.env.ALLOWED_CORS ? process.env.ALLOWED_CORS.split(" ") : [],
        credentials: true
    })
)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.use("*", async (c, next) => {
    const sessionId = getCookie(c, "sessionId")
    if (!sessionId) {
        return await next()
    }
    const now = new Date();
    const record = await db.session.findUnique({
        where: {id: sessionId},
        include: {user: true}
    })
    if (!record || record.expiry < now) {
        deleteCookie(c, "sessionId")
        return await next()
    }
    c.set("user", record.user)
    c.set("sessionId", record.id)
    return await next()
})

app.route("/user-data", testUserDataRouter)
app.route("/tuning", tuningRouter)
app.route("/scale-shape", scaleShapeRouter)
app.route("/chord-shape", chordShapeRouter)
app.route("/auth", authRouter)
app.route("/prefs", prefsRouter)
