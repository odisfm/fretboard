import { db } from "@fretboard/shared/db"
import {type TestUserDataResponse, TestUserDataSchema} from "@fretboard/shared/types/apiResponses";
import {Prisma} from "@fretboard/shared/prisma/client";
import {formatBulkUserData} from "../utils/formatBulkUserData";
import {createHono} from "../helpers/createHono";
import {needsAuth} from "../middleware/needsAuth";

export const testUserDataRouter = createHono()

testUserDataRouter.get("/", needsAuth, async (c) => {
    const userId = c.get("user")!.id
    const userRecord = await db.user.findUnique({
        where: {id: userId},
        include: {
            scales: {
                orderBy: [
                    {createdAt: "asc"}
                ]
            },
            tunings: {
                orderBy: [
                    {createdAt: "asc"}
                ]
            },
            scaleShapes: {
                orderBy: [
                    {createdAt: "asc"}
                ]
            },
            chordShapes: {
                orderBy: [
                    {createdAt: "asc"}
                ]
            }
        }
    })
    if (!userRecord) {
        return c.json({error: 'User not found'}, 404)
    }

    const {scales, scaleShapes, tunings, chordShapes} = formatBulkUserData(userRecord)

    return c.json({scales, tunings, scaleShapes, chordShapes} satisfies TestUserDataResponse, 200)


})

testUserDataRouter.post("/", needsAuth, async (c) => {
    const start = performance.now()
    const userId = c.get("user")!.id
    const body = await c.req.json()
    let update: TestUserDataResponse
    try {
        update = TestUserDataSchema.parse(body)
    } catch (e) {
        console.error(e)
        return c.json({error: "Malformed data"}, 400)
    }
    try {
        await db.$transaction(async (tx) => {
            if (update.tunings.length > 0) {
                const values = update.tunings.map(t =>
                    Prisma.sql`(${t.id}, ${userId}, ${JSON.stringify({...t})}::jsonb)`
                );
                await tx.$executeRaw`
                    INSERT INTO "Tuning" (id, "userId", data)
                    VALUES ${Prisma.join(values)} ON CONFLICT (id) DO
                    UPDATE
                        SET data = EXCLUDED.data, "userId" = EXCLUDED."userId"
                `;
                const tuningIds = update.tunings.map(t => t.id);
                await tx.$executeRaw`
                    DELETE
                    FROM "Tuning"
                    WHERE "userId" = ${userId}
                      AND id NOT IN (${Prisma.join(tuningIds)})
                `;
            } else {
                await tx.$executeRaw`
                    DELETE
                    FROM "Tuning"
                    WHERE "userId" = ${userId}
                `;
            }

            if (update.scaleShapes.length > 0) {
                const values = update.scaleShapes.map(s =>
                    Prisma.sql`(${s.id}, ${userId}, ${JSON.stringify({...s})}::jsonb)`
                );
                await tx.$executeRaw`
                    INSERT INTO "ScaleShape" (id, "userId", data)
                    VALUES ${Prisma.join(values)} ON CONFLICT (id) DO
                    UPDATE
                        SET data = EXCLUDED.data, "userId" = EXCLUDED."userId"
                `;
                const shapeIds = update.scaleShapes.map(s => s.id);
                await tx.$executeRaw`
                    DELETE
                    FROM "ScaleShape"
                    WHERE "userId" = ${userId}
                      AND id NOT IN (${Prisma.join(shapeIds)})
                `;
            } else {
                await tx.$executeRaw`
                    DELETE
                    FROM "ScaleShape"
                    WHERE "userId" = ${userId}
                `;
            }

            if (update.scales.length > 0) {
                const values = update.scales.map(s =>
                    Prisma.sql`(${s.id}, ${userId}, ${JSON.stringify({...s})}::jsonb)`
                );
                await tx.$executeRaw`
                    INSERT INTO "Scale" (id, "userId", data)
                    VALUES ${Prisma.join(values)} ON CONFLICT (id) DO
                    UPDATE
                        SET data = EXCLUDED.data, "userId" = EXCLUDED."userId"
                `;
                const scaleIds = update.scales.map(s => s.id);
                await tx.$executeRaw`
                    DELETE
                    FROM "Scale"
                    WHERE "userId" = ${userId}
                      AND id NOT IN (${Prisma.join(scaleIds)})
                `;
            } else {
                await tx.$executeRaw`
                    DELETE
                    FROM "Scale"
                    WHERE "userId" = ${userId}
                `;
            }

            if (update.chordShapes.length > 0) {
                const values = update.chordShapes.map(s =>
                    Prisma.sql`(${s.id}, ${userId}, ${JSON.stringify({...s})}::jsonb)`
                );
                await tx.$executeRaw`
                    INSERT INTO "ChordShape" (id, "userId", data)
                    VALUES ${Prisma.join(values)} ON CONFLICT (id) DO
                    UPDATE
                        SET data = EXCLUDED.data, "userId" = EXCLUDED."userId"
                `;
                const shapeIds = update.chordShapes.map(s => s.id);
                await tx.$executeRaw`
                    DELETE
                    FROM "ChordShape"
                    WHERE "userId" = ${userId}
                      AND id NOT IN (${Prisma.join(shapeIds)})
                `;
            } else {
                await tx.$executeRaw`
                    DELETE
                    FROM "ChordShape"
                    WHERE "userId" = ${userId}
                `;
            }
        });
    } catch (e) {
        console.error(e)
        return c.json({error: "Internal server error"}, 500)
    }

    const userRecord = await db.user.findUnique({
        where: {id: userId},
        include: {
            scales: {
                orderBy: [
                    {createdAt: "asc"}
                ]
            },
            tunings: {
                orderBy: [
                    {createdAt: "asc"}
                ]
            },
            scaleShapes: {
                orderBy: [
                    {createdAt: "asc"}
                ]
            },
            chordShapes: {
                orderBy: [
                    {createdAt: "asc"}
                ]
            }
        }
    })
    if (!userRecord) {
        return c.json({error: 'User not found'}, 404)
    }

    const {scales, scaleShapes, tunings, chordShapes} = formatBulkUserData(userRecord)

    const end = performance.now()

    return c.json({scales, scaleShapes, tunings, chordShapes} satisfies TestUserDataResponse, 200)
})
