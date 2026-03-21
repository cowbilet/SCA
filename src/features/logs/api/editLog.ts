import { z } from "zod"
import { createServerFn } from "@tanstack/react-start"
import { restrictToSelf } from "@/utils/auth"
import { dbEditLogEntry, dbGetLogEntry } from "@/db/logs.server"

export const editLog = createServerFn({ method: 'POST' }).inputValidator(z.object({
    logId: z.uuid(),
    description: z.string().min(1),
    date: z.coerce.date(),
})).handler(async ({data}) => {
    const { logId, description, date } = data
    const log = await dbGetLogEntry(logId)
    if (!log) {
        throw new Error("Log entry not found")
    }
    await restrictToSelf({ data: log.studentId })
    const logEntry = await dbEditLogEntry(logId, date, description)
    if (!logEntry) {
        throw new Error("Failed to edit log entry")
    }
    return logEntry
})