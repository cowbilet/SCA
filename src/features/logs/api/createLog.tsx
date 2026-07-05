import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { restrictRoles } from '@/utils/auth'
import { dbCreateLogEntry } from '@/db/logs.server'
import { challengeSchema } from '@/types/schemas/challenges'
import { awardSchema } from '@/types/schemas/award'
import { futureDate } from '@/types/schemas/log'
import { dbGetProposal } from '@/db/proposals.server'

export const createLog = createServerFn({ method: 'POST' })
    .inputValidator(
        z.object({
            award: awardSchema,
            challenge: challengeSchema,
            description: z.string().min(1),
            date: futureDate,
        }),
    )
    .handler(async ({ data }) => {
        const { award, challenge, description, date } = data
        const student = await restrictRoles({ data: ['student'] })
        const proposalData = await dbGetProposal(
            student.userId,
            award,
            challenge
        )
        if (!proposalData || proposalData.status !== 'completed') {
            throw new Error("You don't have a proposal for this challenge")
        }
        const logEntry = await dbCreateLogEntry(
            student.userId,
            award,
            challenge,
            date,
            description,
            '',
            [],
        )
        if (!logEntry) {
            throw new Error('Failed to create log entry')
        }
        return logEntry
    })
