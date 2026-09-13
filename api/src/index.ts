import { Hono } from 'hono'
import { cors } from "hono/cors"
import {testUserDataRouter} from "./routes/testUserDataRouter.js";

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
