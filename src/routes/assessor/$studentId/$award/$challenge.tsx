import { validateChallenge } from '@/types/guards/challenges'
import { createFileRoute } from '@tanstack/react-router'
import { validateAward } from '@/types/guards/awards'

import { Award } from '@/types/awards'
import { Challenge } from '@/types/challenges'
import z from 'zod'
import ReviewProposal from '@/features/proposals/components/advisorProposal.tsx/reviewProposal'
import { proposalQueryOptions } from '@/features/proposals/hooks/useProposal'


const inputSchema = z.object({
    award: z.string().refine((award): award is Award => validateAward(award), {
        message: 'Invalid award',
    }),
    challenge: z.string().refine((challenge): challenge is Challenge => validateChallenge(challenge), {
        message: 'Invalid challenge',
    }),
    studentId: z.uuid(),
})
export const Route = createFileRoute(
    '/assessor/$studentId/$award/$challenge',
)({
    component: RouteComponent,
    params: inputSchema,
    loader: async ({ params, context: { queryClient } }) => {
        const { award, challenge, studentId } = params
        return queryClient.ensureQueryData(proposalQueryOptions(award, challenge, studentId))
    },
})

function RouteComponent() {
    return (
        <div className="flex flex-col h-full flex-1 p-4 bg-white rounded-lg shadow">
            <ReviewProposal />
            
        </div>
    )
}
