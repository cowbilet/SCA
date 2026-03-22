import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { restrictRoles } from '@/utils/auth'
import { dbApproveLogEntry, dbGetLogEntry } from '@/db/logs.server'
import { dbGetUserChallenge } from '@/db/challenges.server'

export const approveLog = createServerFn({ method: 'POST' })
    .inputValidator(
        z.object({
            logId: z.uuid(),
            approved: z.boolean(),
            feedback: z.string().optional(),
        }),
    )
    .handler(async ({ data }) => {
        const { logId, approved, feedback } = data
        const mentor = await restrictRoles({ data: ['mentor'] })
        const logEntry = await dbGetLogEntry(logId)
        if (!logEntry) {
            throw new Error('Log entry not found')
        }
        if (logEntry.approved !== null) {
            throw new Error('Log entry already reviewed')
        }
        const challengeData = await dbGetUserChallenge(
            logEntry.studentId,
            logEntry.award,
            logEntry.challenge,
        )
        if (!challengeData) {
            throw new Error('Challenge data not found')
        }
        if (challengeData.student_challenge.mentorId !== mentor.userId) {
            throw new Error('Unauthorized')
        }
        return await dbApproveLogEntry(logId, approved, feedback ?? null)
    })
