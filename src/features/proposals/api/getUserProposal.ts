import { createServerFn } from '@tanstack/react-start'

import { z } from 'zod'
import type { Proposal } from '@/types/schemas/proposal'
import { dbGetProposal } from '@/db/proposals.server'

import { restrictStudentData } from '@/utils/auth'
import { challengeSchema } from '@/types/schemas/challenges'
import { awardSchema } from '@/types/schemas/award'


const getUserProposalSchema = z.object({
    award: awardSchema,
    challenge: challengeSchema,
    studentId: z.uuid(),
})
export const getUserProposal = createServerFn({ method: 'GET' }).inputValidator(getUserProposalSchema).handler(async ({data}): Promise<Proposal | null> => {
    const { award, challenge, studentId } = data
    await restrictStudentData({data: studentId})

    const proposalData = await dbGetProposal(studentId, award, challenge)
    return proposalData
})