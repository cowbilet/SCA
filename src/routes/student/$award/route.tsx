import { Outlet, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { awardSchema } from '@/types/schemas/award'
import { ALL_CHALLENGES } from '@/types/challenges'
import { challengeQueryOptions } from '@/hooks/useChallenge'

export const Route = createFileRoute('/student/$award')({
    component: RouteComponent,
    params: z.object({
        award: awardSchema,
    }),
    loader: async ({ params, context: { queryClient, user } }) => {
        const prefetches = Object.values(ALL_CHALLENGES).map((challenge) =>
            queryClient.ensureQueryData(
                challengeQueryOptions(params.award, challenge, user.userId),
            ),
        )

        // Prefetch all challenge cards, but do not fail route hydration if one challenge query errors.
        await Promise.allSettled(prefetches)
    },
})

function RouteComponent() {
    return (
        <div className="flex-1 bg-gray-100">
            <Outlet />
        </div>
    )
}
