import { createServerFn } from '@tanstack/react-start'

import { dbGetUserByName } from '@/db/users.server'

import { dbGetProposal } from '@/db/proposals.server'
import { validateAward } from '@/types/guards/awards'
import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'
import { z } from 'zod'



import { validateChallenge } from '@/types/guards/challenges'
import { Proposal } from '@/types/schemas/proposal'
import { restrictStudentData } from '@/utils/server/auth.server'


const getUserProposalSchema = z.object({
    award: z.string().refine((award): award is Award => validateAward(award), {
        message: 'Invalid award',
    }),
    challenge: z.string().refine((challenge): challenge is Challenge => validateChallenge(challenge), {
        message: 'Invalid challenge',
    }),
    studentId: z.uuid(),
})
export const getUserProposal = createServerFn({ method: 'GET' }).inputValidator(getUserProposalSchema).handler(async ({data}): Promise<Proposal | null> => {
    const { award, challenge, studentId } = data
    await restrictStudentData({data: studentId})

    const proposalData = await dbGetProposal(studentId, award, challenge,)
    return proposalData
})