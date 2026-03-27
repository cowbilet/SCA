import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { dbChangeProposalStatus, dbGetProposal } from '@/db/proposals.server'
import { restrictRoles } from '@/utils/auth'
import { awardSchema } from '@/types/schemas/award'
import { challengeSchema } from '@/types/schemas/challenges'

const withdrawProposalSchema = z.object({
    award: awardSchema,
    challenge: challengeSchema,
})
export const withdrawProposal = createServerFn({ method: 'GET' })
    .inputValidator(withdrawProposalSchema)
    .handler(async ({ data }) => {
        const { award, challenge } = data
        const student = await restrictRoles({ data: ['student'] })

        const proposalData = await dbGetProposal(
            student.userId,
            award,
            challenge,
        )
        if (!proposalData) {
            throw new Error('No proposal found to withdraw')
        }
        await dbChangeProposalStatus(
            student.userId,
            award,
            challenge,
            'withdrawn',
        )
    })
