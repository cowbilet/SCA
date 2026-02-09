import { createServerFn } from '@tanstack/react-start'
import { getDbUserAwardChallenges } from '@/db/SCA.server'
import { getDbUserByName } from '@/db/users.server'
import { validateAward } from '@/guards/SCA'
import { Awards } from '@/types/SCA'
import { z } from 'zod'
const inputSchema = z.object({
    award: z.string().refine((award): award is Awards => validateAward(award), {
        message: 'Invalid award',
    }),
})
export const getUserAwardChallenges = createServerFn({ method: 'GET' }).inputValidator(inputSchema).handler(async ({data}) => {
    const user = (await getDbUserByName("Seb"))[0]
    const challenges = await getDbUserAwardChallenges(user.userId, data.award)
    return challenges
})