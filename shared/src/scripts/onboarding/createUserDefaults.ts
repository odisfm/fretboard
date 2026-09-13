import {db} from "../../db"
import {defaultScales} from "./defaultScales";
import {defaultTunings} from "./defaultTunings";
import commandLineArgs from 'command-line-args'

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

    const userScales = defaultScales.map((s) => {
        return {data: s, userId}
    })

    const scaleInsert = await db.scale.createMany({
        data:
        userScales
    })

    const userTunings = defaultTunings.map((t) => {
        return {data: t, userId}
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
