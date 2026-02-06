import { createFileRoute } from '@tanstack/react-router'

import { validateTier } from '@/guards/SCA'
export const Route = createFileRoute('/student/$tier')({
    component: RouteComponent,
    beforeLoad: async ({ params }) => {
        const { tier } = params
        if (!validateTier(tier)) {
            throw new Response('Invalid tier', { status: 400 })
        }
    }
})


function RouteComponent() {
    return <div>Please select a challenge</div>
}
