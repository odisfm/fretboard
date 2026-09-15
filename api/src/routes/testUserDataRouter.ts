import { Hono } from 'hono'
import { db } from "@fretboard/shared/db"
import {type TestUserDataResponse, TestUserDataSchema} from "@fretboard/shared/types/apiResponses";
import {Prisma} from "@fretboard/shared/prisma/client";
import {formatBulkUserData} from "../utils/formatBulkUserData";

export const testUserDataRouter = new Hono()

testUserDataRouter.get("/:userId", async (c) => {
    const userId = c.req.param("userId")
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
            shapes: {
                orderBy: [
                    {createdAt: "asc"}
                ]
            },
        }
    })
    if (!userRecord) {
        return c.json({error: 'User not found'}, 404)
    }

    const {scales, shapes, tunings} = formatBulkUserData(userRecord)

    return c.json({scales, tunings, shapes: shapes} satisfies TestUserDataResponse, 200)


})

testUserDataRouter.post("/:userId", async (c) => {
    console.log("doing bulk userData update")
    const start = performance.now()
    const userId = c.req.param("userId")
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

            if (update.shapes.length > 0) {
                const values = update.shapes.map(s =>
                    Prisma.sql`(${s.id}, ${userId}, ${JSON.stringify({...s})}::jsonb)`
                );
                await tx.$executeRaw`
                    INSERT INTO "Shape" (id, "userId", data)
                    VALUES ${Prisma.join(values)} ON CONFLICT (id) DO
                    UPDATE
                        SET data = EXCLUDED.data, "userId" = EXCLUDED."userId"
                `;
                const shapeIds = update.shapes.map(s => s.id);
                await tx.$executeRaw`
                    DELETE
                    FROM "Shape"
                    WHERE "userId" = ${userId}
                      AND id NOT IN (${Prisma.join(shapeIds)})
                `;
            } else {
                await tx.$executeRaw`
                    DELETE
                    FROM "Shape"
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
        });
    } catch (e) {
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
            shapes: {
                orderBy: [
                    {createdAt: "asc"}
                ]
            },
        }
    })
    if (!userRecord) {
        return c.json({error: 'User not found'}, 404)
    }

    const {scales, shapes, tunings} = formatBulkUserData(userRecord)

    const end = performance.now()
    console.log(`updated user in ${end - start}ms`)

    return c.json({scales, shapes, tunings} satisfies TestUserDataResponse, 200)
})
