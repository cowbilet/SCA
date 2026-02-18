import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { validateAward } from '@/types/guards/awards'
import { Award } from '@/types/awards'
import { validateChallenge } from '@/types/guards/challenges'
import { Challenge } from '@/types/challenges'
import { dbChangeProposalStatus, getDbChallengeProposal } from '@/db/proposals.server'
import { getDbUserByName } from '@/db/users.server'
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
    const student = (await getDbUserByName("Seb"))[0]
    const studentId = student.userId
    
    const proposalData = await getDbChallengeProposal(studentId, award, challenge)
    if (!proposalData || proposalData.length === 0) {
        throw new Error("No proposal found to withdraw")
    }
    const proposal = proposalData[0]
    const proposalId = proposal.proposalId
    await dbChangeProposalStatus(proposalId, 'withdrawn')
    return proposalData[0] || null
})