import { Hono } from 'hono'
import { cors } from "hono/cors"
import {testUserDataRouter} from "./routes/testUserDataRouter.js";
import {tuningRouter} from "./routes/tuning";
import {shapeRouter} from "./routes/shape";

export const app = new Hono()

app.use(
    cors({
      origin: process.env.ALLOWED_CORS ? process.env.ALLOWED_CORS.split(" ") : [],
    })
)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route("/user-data", testUserDataRouter)
app.route("/tuning", tuningRouter)
app.route("/shape", shapeRouter)
