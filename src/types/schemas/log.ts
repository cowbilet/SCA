import { z } from 'zod'
import { challengeSchema } from './challenges'
import { awardSchema } from './award'

export const futureDate = z.coerce.date<string>().refine(
    (date) => {
        const today = new Date()
        return date <= today
    },
    {
        message: 'Date cannot be in the future',
    },
)
export const CreateLogEntrySchema = z.object({
    date: futureDate,
    description: z
        .string()
        .trim()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description must be 1000 characters or less'),
})
export const LogEntrySchema = z.object({
    logId: z.uuid(),
    studentId: z.uuid(),
    award: awardSchema,
    challenge: challengeSchema,
    date: z.string(),
    description: z.string().min(1),
    approved: z.boolean().nullable(),
    feedback: z.string().nullable(),
    evidence: z.string(),
    files: z.array(z.string()),
})
export type LogEntry = z.infer<typeof LogEntrySchema>
