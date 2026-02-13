import { createServerFn } from '@tanstack/react-start'
import { validateAward } from '@/types/guards/awards'
import { Award } from '@/types/awards'
import { z } from 'zod'
import { StudentChallengeSchema } from '@/types/schemas/challenges'

import { validateChallenge } from '@/types/guards/challenges'
import { Challenge } from '@/types/challenges'
import { getDbUserChallenge } from '@/db/challenges.server'
import { getDbUserByName } from '@/db/users.server'
const inputSchema = z.object({
    award: z.string().refine((award): award is Award => validateAward(award), {
        message: 'Invalid award',
    }),
    challenge: z.string().refine((challenge): challenge is Challenge => validateChallenge(challenge), {
        message: 'Invalid challenge',
    }),
})
export const getUserChallenge = createServerFn({ method: 'GET' }).inputValidator(inputSchema).handler(async ({data}): Promise<StudentChallengeSchema | null> => {
    const { award, challenge } = data
    const user = (await getDbUserByName("Seb"))[0]
    // For now we are just going to return the challenge data for the first user since we don't have authentication set up, but in the future we will need to get the user from the session and return their specific challenge data
    const challengeData = await getDbUserChallenge(user.userId, award, challenge)
    return challengeData[0] || null
})