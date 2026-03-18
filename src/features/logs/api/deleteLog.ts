import { z } from "zod"
import { createServerFn } from "@tanstack/react-start"
import { restrictRoles } from "@/utils/auth"
import { dbDeleteLogEntry, dbGetLogEntry } from "@/db/logs.server"

export const deleteLog = createServerFn({ method: 'POST' }).inputValidator(z.object({
    logId: z.uuid(),
})).handler(async ({data}) => {
    const { logId } = data
    await restrictRoles({ data: ["student"] })
    const log = await dbGetLogEntry(logId)
    if (!log) {
        throw new Error("Log entry not found")
    }
    const logEntry = await dbDeleteLogEntry(logId)
    if (!logEntry) {
        throw new Error("Failed to delete log entry")
    }
    return logEntry
})