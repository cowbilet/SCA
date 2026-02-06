import { createFileRoute } from '@tanstack/react-router'
import { ALL_AWARDS } from '@/types/SCA'
export const Route = createFileRoute('/student/$tier')({
    component: RouteComponent,
    beforeLoad: async ({ params }) => {
        const { tier } = params
        if (!validateTier(tier)) {
            throw new Response('Invalid tier', { status: 400 })
        }
    }
})
function validateTier(tier: string): tier is typeof ALL_AWARDS[number] {
    return ALL_AWARDS.includes(tier as typeof ALL_AWARDS[number])
}

function RouteComponent() {
    return <div>Hello "/student/$tier"!</div>
}
