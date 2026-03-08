import { createServerFn } from '@tanstack/react-start'
import { validateAward } from '@/types/guards/awards'
import { Award } from '@/types/awards'
import { z } from 'zod'
import { StudentChallengeWithProposalAndSubmission } from '@/types/schemas/challenges'

import { validateChallenge } from '@/types/guards/challenges'
import { Challenge } from '@/types/challenges'
import { dbGetUserByName } from '@/db/users.server'
import { dbGetUserChallenge } from '@/db/challenges.server'
import { ensureSession, restrictRoles } from '@/utils/auth'
import { dbGetMentorStudents } from '@/db/mentors.server'
const inputSchema = z.object({
    award: z.string().refine((award): award is Award => validateAward(award), {
        message: 'Invalid award',
    }),
    challenge: z.string().refine((challenge): challenge is Challenge => validateChallenge(challenge), {
        message: 'Invalid challenge',
    }),
})
export const getUserChallenge = createServerFn({ method: 'GET' }).inputValidator(inputSchema).handler(async ({data}): Promise<StudentChallengeWithProposalAndSubmission | null> => {
    const { award, challenge } = data
    const user = await restrictRoles({ data: ["student"] })
    return await dbGetUserChallenge(user.userId, award, challenge)
})