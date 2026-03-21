import { Outlet, createFileRoute } from '@tanstack/react-router'
import {z} from 'zod'
import { awardSchema } from '@/types/schemas/award'
import { ALL_CHALLENGES } from '@/types/challenges'
import { challengeQueryOptions } from '@/hooks/useChallenge'

export const Route = createFileRoute('/student/$award')({
    component: RouteComponent,
    params: z.object({
        award: awardSchema,
    }),
    loader: async ({ params, context: { queryClient, user } }) => {
        const promises = []
        for (const challenge of Object.values(ALL_CHALLENGES)) {
            promises.push(queryClient.ensureQueryData(challengeQueryOptions(params.award, challenge, user.userId)))
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
