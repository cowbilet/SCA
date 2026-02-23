import { createServerFn } from '@tanstack/react-start'
import { dbGetProposal } from '@/db/proposals.server'
import { z } from 'zod'
import { validateAward } from '@/types/guards/awards'
import { Award } from '@/types/awards'
import { validateChallenge } from '@/types/guards/challenges'
import { Challenge } from '@/types/challenges'
import { Proposal } from '@/types/schemas/proposal'

const getStudentProposalSchema = z.object({
    award: z.string().refine((award): award is Award => validateAward(award), {
        message: 'Invalid award',
    }),
    challenge: z.string().refine((challenge): challenge is Challenge => validateChallenge(challenge), {
        message: 'Invalid challenge',
    }),
    studentId: z.uuid(),
})
export const getStudentProposal = createServerFn({ method: 'GET' }).inputValidator(getStudentProposalSchema).handler(async ({ data }: { data: { award: Award, challenge: Challenge, studentId: string } }): Promise<Proposal | null> => {
    const { award, challenge, studentId } = data
    const proposalData = await dbGetProposal(studentId, award, challenge)
    return proposalData || null
  })