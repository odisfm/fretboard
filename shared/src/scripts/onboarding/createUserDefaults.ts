import {db} from "../../db"
import {defaultScales} from "./defaultScales";
import {defaultTunings} from "./defaultTunings";
import commandLineArgs from 'command-line-args'
import {LexoRank} from "@dalet-oss/lexorank";

const optionDefinitions = [
    {name: "userId", alias: "u", type: String, required: true},
    {name: "replace", alias: "r", type: Boolean}
]
const options = commandLineArgs(optionDefinitions);
if (!options.userId) {
    console.error(`Missing userId`)
    process.exit(1)
}

async function createUserDefaults(userId: string) {
    const user = await db.user.findUnique({
        where: {
            id: userId
        }
    })
    if (!user) {
        throw new Error(`No user with id "${userId}"`)
    }

    let lastRank = LexoRank.middle()
    const userScales = defaultScales.map((s) => {
        lastRank = lastRank.genNext()
        return {data: {...s, order: lastRank["value"]}, userId}
    })

    const scaleInsert = await db.scale.createMany({
        data:
        userScales
    })

    lastRank = LexoRank.middle()
    const userTunings = defaultTunings.map((t) => {
        lastRank = lastRank.genNext()
        return {data: {...t, order: lastRank["value"]}, userId}
    })

    const tuningInsert = await db.tuning.createMany({
        data:
        userTunings,
    })
}

async function truncateUserData(userId: string) {
    await db.scale.deleteMany({
        where: {
            userId
        }
    })

    await db.tuning.deleteMany({
        where: {
            userId
        }
    })
}

try {
    if (options.replace) {
        await truncateUserData(options.userId)
    }
    await createUserDefaults(options.userId)
} catch (e) {
    console.error(e)
    process.exit(1)
}
console.log("Success!")
process.exit(0)
