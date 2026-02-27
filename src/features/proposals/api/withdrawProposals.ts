import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { validateAward } from '@/types/guards/awards'
import { Award } from '@/types/awards'
import { validateChallenge } from '@/types/guards/challenges'
import { Challenge } from '@/types/challenges'
import { dbChangeProposalStatus, dbGetProposal } from '@/db/proposals.server'
import { dbGetUserByName } from '@/db/users.server'
import { restrictRoles } from '@/utils/server/auth.server'
const withdrawProposalSchema = z.object({
    award: z.string().refine((award): award is Award => validateAward(award), {
        message: 'Invalid award',
    }),
    challenge: z.string().refine((challenge): challenge is Challenge => validateChallenge(challenge), {
        message: 'Invalid challenge',
    }),
})
export const withdrawProposal = createServerFn({ method: 'GET' }).inputValidator(withdrawProposalSchema).handler(async ({data}) => {
    const { award, challenge } = data
    const student = await restrictRoles({ data: ["student"] })
    
    const proposalData = await dbGetProposal(student.userId, award, challenge)
    if (!proposalData) {
        throw new Error("No proposal found to withdraw")
    }
    await dbChangeProposalStatus(student.userId, award, challenge, 'withdrawn')
})