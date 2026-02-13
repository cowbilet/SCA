import { createFileRoute, Outlet } from '@tanstack/react-router'

import { validateAward } from '@/types/guards/awards'
import { challengesQueryOptions } from '@/hooks/useChallenge'
import { Award } from '@/types/awards'
import { z } from 'zod'

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
    loader: ({ params, context: {queryClient} }) => {
        const { award } = params
        return queryClient.ensureQueryData(challengesQueryOptions(award))
    },
})

function RouteComponent() {
    return (
        <div className='flex-1 bg-gray-50'>
            <Outlet />
        </div>
    )
}
