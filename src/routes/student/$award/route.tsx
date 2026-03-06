import { createFileRoute, Outlet } from '@tanstack/react-router'

import { validateAward } from '@/types/guards/awards'
import { Award } from '@/types/awards'
import { z } from 'zod'
import { ALL_CHALLENGES } from '@/types/challenges'
import { challengeQueryOptions } from '@/hooks/useChallenge'

const awardSchema = z.string().refine((award): award is Award => validateAward(award), {
    message: 'Invalid award',
})
export const Route = createFileRoute('/student/$award')({
    component: RouteComponent,
    params: {
        parse: (rawParams) => {
            const result = awardSchema.safeParse(rawParams.award)
            if (!result.success) {
                throw new Response('Invalid award', { status: 400 })
            }
            return { award: result.data }
        }
    },
    loader: async ({ params, context: { queryClient } }) => {
        const promises = []
        for (const challenge of Object.values(ALL_CHALLENGES)) {
            promises.push(queryClient.ensureQueryData(challengeQueryOptions(params.award, challenge)))
        }
        await Promise.all(promises)
    }
})

function RouteComponent() {
    return (
        <div className='flex-1 bg-gray-100'>
            <Outlet />
        </div>
    )
}
