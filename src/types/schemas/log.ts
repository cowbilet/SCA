import { z } from "zod";
import type { Award } from "@/types/awards";
import type { Challenge } from "@/types/challenges";

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
    award: z.string().refine((value): value is Award => ['bronze', 'silver', 'gold'].includes(value), {
        message: 'Invalid award tier',
    }),
    challenge: z.string().refine((value): value is Challenge => ['challenge1', 'challenge2', 'challenge3'].includes(value), {
        message: 'Invalid challenge',
    }),
    date: z.string(),
    description: z.string(),
    approved: z.boolean().nullable(),
    feedback: z.string().nullable(),
    evidence: z.string(),
})
export type LogEntry = z.infer<typeof LogEntrySchema>