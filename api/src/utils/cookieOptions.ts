import type {CookieOptions} from "hono/utils/cookie";
import {SESSION_EXPIRY} from "../consts";

export const authCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    maxAge: SESSION_EXPIRY / 1000,
    sameSite: "lax",
    path: "/"
}