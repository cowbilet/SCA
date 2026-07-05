import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { restrictRoles } from '@/utils/auth'
import { dbAddLogFile, dbGetLogEntry } from '@/db/logs.server'
import { awardSchema } from '@/types/schemas/award'
import { challengeSchema } from '@/types/schemas/challenges'

const recordUploadedFileSchema = z.object({
    award: awardSchema,
    challenge: challengeSchema,
    logId: z.uuid(),
    fileName: z.string().min(1),
})

export const recordUploadedFile = createServerFn({ method: 'POST' })
    .inputValidator(recordUploadedFileSchema)
    .handler(async ({ data }: { data: z.infer<typeof recordUploadedFileSchema> }) => {
        const logEntry = await dbGetLogEntry(data.logId)
        const student = await restrictRoles({ data: ['student'] })

        if (!logEntry || logEntry.studentId !== student.userId) {
            throw new Error('Unauthorized')
        }

        return dbAddLogFile(data.logId, data.fileName)
    })