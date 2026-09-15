import * as z from "zod";

export const TuningSchema = z.object({
    id: z.uuidv4(),
    name: z.string().optional(),
    strings: z.array(z.number()),
    capo: z.array(z.number()),
    fretCount: z.number(),
    instrument: z.string().optional(),
    order: z.string(),
    updatedAt: z.coerce.date().optional()
})

export type Tuning = z.infer<typeof TuningSchema>

export const eStandardTuning: Tuning = {
    id: "158376bd-a42b-4c7e-bd54-e3f8a0a4ac37",
    name: "Standard",
    strings: [40, 45, 50, 55, 59, 64],
    capo: [0, 0, 0, 0, 0, 0],
    fretCount: 24,
    order: "a"
}
