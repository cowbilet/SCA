import { createFileRoute } from '@tanstack/react-router'

import { validateAward } from '@/guards/SCA'
import { challengesQueryOptions } from '@/hooks/useChallenge'
import { Awards } from '@/types/SCA'
import { z } from 'zod'
const awardSchema = z.string().refine((award): award is Awards => validateAward(award), {
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
    return <div>Please select a challenge</div>
}
