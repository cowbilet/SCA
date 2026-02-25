import { validateChallenge } from '@/types/guards/challenges'
import { createFileRoute } from '@tanstack/react-router'
import { validateAward } from '@/types/guards/awards'

import { Award } from '@/types/awards'
import { Challenge } from '@/types/challenges'
import z from 'zod'
import ReviewProposal from '@/features/proposals/components/mentorProposal.tsx/reviewProposal'
import { getStudentProposal } from '@/features/proposals/api/getStudentProposal'


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
    '/mentor/$studentId/$award/$challenge',
)({
    component: RouteComponent,
    params: inputSchema,
    loader: async ({ params }) => {
        const { award, challenge, studentId } = params
        const proposal = await getStudentProposal({data: { award, challenge, studentId }})
        if (!proposal) {
            throw new Error("Proposal not found")
        }
        return proposal
    },
})

function RouteComponent() {
    const proposalData = Route.useLoaderData()
    return (
        <div className="flex flex-col h-full flex-1 p-4 bg-white rounded-lg shadow">
            <ReviewProposal proposal={proposalData} />
            
        </div>
    )
}
