import { z } from "zod";
import { challengeSchema } from "./challenges";
import { awardSchema } from "./award";

export const futureDate = z.coerce.date<string>().refine((date) => {
    const today = new Date()
    return date <= today
}, {
    message: 'Date cannot be in the future',
})
export const CreateLogEntrySchema = z.object({
    date: futureDate,
    description: z.string(),
})
export const LogEntrySchema = z.object({
    logId: z.uuid(),
    studentId: z.uuid(),
    award: awardSchema,
    challenge: challengeSchema,
    date: z.string(),
    description: z.string(),
    approved: z.boolean().nullable(),
    feedback: z.string(),
    evidence: z.string(),
})
export type LogEntry = z.infer<typeof LogEntrySchema>