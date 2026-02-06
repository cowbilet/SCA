import { createFileRoute } from '@tanstack/react-router'

import { validateAward } from '@/guards/SCA'
import { challengesQueryOptions } from '@/hooks/useChallenge'


export const Route = createFileRoute('/student/$award')({
    component: RouteComponent,
    loader: ({ params, context: {queryClient} }) => {
        const { award } = params
        if (!validateAward(award)) {
            throw new Response('Invalid award', { status: 400 })
        }
        return queryClient.ensureQueryData(challengesQueryOptions(award))
    },
    beforeLoad: async ({ params }) => {
        const { award } = params
        if (!validateAward(award)) {
            throw new Response('Invalid award', { status: 400 })
        }
    }
})


function RouteComponent() {
    return <div>Please select a challenge</div>
}
