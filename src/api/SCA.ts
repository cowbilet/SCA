import { createServerFn } from '@tanstack/react-start'
import { getDbUserAwardChallenges } from '@/db/SCA.server'
import { getDbUserByName } from '@/db/users.server'
import { validateAward } from '@/guards/SCA'
import { Awards } from '@/types/SCA'
export const getUserAwardChallenges = createServerFn({ method: 'GET' }).inputValidator(async (data: {award: Awards}) => {
    // if (typeof data.userId !== 'string') {
    //     throw new Response('Invalid userId', { status: 400 })
    // }
    if (typeof data.award !== 'string') {
        throw new Response('Invalid award', { status: 400 })
    }
    if (!validateAward(data.award)) {
        throw new Response('Invalid award', { status: 400 })
    }
    // const user = await getDbUserById(data.userId)
    // if (!user || user.length === 0) {
    //     throw new Response('User not found', { status: 404 })
    // }

    return {user: (await getDbUserByName("Seb"))[0], award: data.award}
}).handler(async ({data}) => {
    const challenges = await getDbUserAwardChallenges(data.user.userId, data.award)
    return challenges
})