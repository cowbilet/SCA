import { createServerFn } from '@tanstack/react-start'
import { validateAward } from '@/types/guards/awards'
import { Award } from '@/types/awards'
import { z } from 'zod'
import { StudentChallengeWithProposalAndSubmission } from '@/types/schemas/challenges'

import { validateChallenge } from '@/types/guards/challenges'
import { Challenge } from '@/types/challenges'
import { dbGetUserByName } from '@/db/users.server'
import { dbGetUserChallenge } from '@/db/challenges.server'
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
    const user = await dbGetUserByName("Seb")
    if (!user) {
        throw new Error("User not found")
    }
    // For now we are just going to return the challenge data for the first user since we don't have authentication set up, but in the future we will need to get the user from the session and return their specific challenge data
    const challengeData = await dbGetUserChallenge(user.userId, award, challenge)
    return challengeData
})