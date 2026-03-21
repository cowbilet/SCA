import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { StudentChallengeWithProposalAndSubmission } from '@/types/schemas/challenges'
import type { Challenge } from '@/types/challenges'
import type { Award } from '@/types/awards'
import { validateAward } from '@/types/guards/awards'

import { validateChallenge } from '@/types/guards/challenges'
import { dbGetUserChallenge } from '@/db/challenges.server'
import { restrictRoles, restrictStudentData } from '@/utils/auth'

const inputSchema = z.object({
    award: z.string().refine((award): award is Award => validateAward(award), {
        message: 'Invalid award',
    }),
    challenge: z.string().refine((challenge): challenge is Challenge => validateChallenge(challenge), {
        message: 'Invalid challenge',
    }),
    studentId: z.uuid()
})
export const getUserChallenge = createServerFn({ method: 'GET' }).inputValidator(inputSchema).handler(async ({data}): Promise<StudentChallengeWithProposalAndSubmission | null> => {
    const { award, challenge, studentId } = data
    await restrictStudentData({ data: studentId })
    const result = await dbGetUserChallenge(studentId, award, challenge, )
    return result
})