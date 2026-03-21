import { createFileRoute } from '@tanstack/react-router'

import z from 'zod'
import ReviewProposal from '@/features/proposals/components/advisorProposal.tsx/reviewProposal'

import { proposalQueryOptions } from '@/features/proposals/hooks/useProposal'
import { awardSchema } from '@/types/schemas/award'
import { challengeSchema } from '@/types/schemas/challenges'
import { AdvisorActivityLogs } from '@/features/logs/components/advisors/advisorLogs'
import ReviewActivity from '@/features/logs/components/advisors/reviewActivity'

const inputSchema = z.object({
    award: awardSchema,
    challenge: challengeSchema,
    studentId: z.uuid(),
})
export const Route = createFileRoute(
    '/$advisor/$studentId/$award/$challenge',
)({
    component: RouteComponent,
    params: inputSchema,
    loader: async ({ params, context: { queryClient } }) => {
        const { award, challenge, studentId } = params
        const data = await queryClient.ensureQueryData(proposalQueryOptions(award, challenge, studentId))
        return data 
    },
})

function RouteComponent() {
    const proposalData = Route.useLoaderData()
    if (proposalData?.accepted === true) {
        return <ReviewActivity />
    }
    else {
        return (
            <div className="flex flex-col h-full flex-1 p-4 bg-white rounded-lg shadow">
                <ReviewProposal />
    
            </div>
        )
    }
}
