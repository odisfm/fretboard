import {Hono} from "hono";
import {type UserGetPayload} from "@fretboard/shared/prisma/models/User";

type AppVariables = {
    user?: UserGetPayload<any>
    sessionId?: string
}

export function createHono() {
    return new Hono<{Variables: AppVariables}>()
}
