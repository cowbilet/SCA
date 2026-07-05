import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { restrictToSelf } from '@/utils/auth'
import { dbEditLogEntry, dbGetLogEntry } from '@/db/logs.server'

export const editLog = createServerFn({ method: 'POST' })
    .inputValidator(
        z.object({
            logId: z.uuid(),
            description: z.string().min(1),
            date: z.coerce.date(),
            approved: z.boolean().optional().nullable(),
            files: z.array(z.string()).optional(),
        }),
    )
    .handler(async ({ data }) => {
        const { logId, description, date, approved, files } = data
        const log = await dbGetLogEntry(logId)
        if (!log) {
            throw new Error('Log entry not found')
        }
        await restrictToSelf({ data: log.studentId })
        if (log.approved) {
            throw new Error('Cannot edit a log entry that has already been accepted')
        }
        if (log.approved === null && approved !== undefined) {
            throw new Error('Cannot change the approval status of a pending log entry')
        }
        if (log.approved === false && approved) {
            throw new Error('Cannot change a rejected log entry to approved')
        }
        const logEntry = await dbEditLogEntry(
            logId,
            date,
            description,
            approved,
            files,
        )
        if (!logEntry) {
            throw new Error('Failed to edit log entry')
        }
        return logEntry
    })
