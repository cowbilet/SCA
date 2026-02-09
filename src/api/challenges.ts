import { createServerFn } from '@tanstack/react-start'
import { getDbUserAwardChallenges } from '@/db/challenges.server'
import { getDbUserByName } from '@/db/users.server'
import { validateAward } from '@/types/guards/awards'
import { Awards } from '@/types/awards'
import { z } from 'zod'
import { StudentChallenge } from '@/types/schemas/challenges'
const inputSchema = z.object({
    award: z.string().refine((award): award is Awards => validateAward(award), {
        message: 'Invalid award',
    }),
})
export const getUserAwardChallenges = createServerFn({ method: 'GET' }).inputValidator(inputSchema).handler(async ({data}): Promise<StudentChallenge[]> => {
    const user = (await getDbUserByName("Seb"))[0]
    const challenges = await getDbUserAwardChallenges(user.userId, data.award, "student")
    return challenges
})