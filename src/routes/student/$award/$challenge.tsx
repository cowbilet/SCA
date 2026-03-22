import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'

import ChallengeShell from '@/components/student/challenge'
import { challengeSchema } from '@/types/schemas/challenges'
import { challengeQueryOptions } from '@/hooks/useChallenge'
import { proposalQueryOptions } from '@/features/proposals/hooks/useProposal'

import { awardSchema } from '@/types/schemas/award'
import MainStudentDash from '@/features/dashboard/components/student/mainStudentDash'

export const Route = createFileRoute('/student/$award/$challenge')({
    component: () => <RouteComponent />,
    params: z.object({
        award: awardSchema,
        challenge: challengeSchema,
    }),
    shouldReload: false,
    // TODO: If you go to the student page and hover over any page it preloads the data, this is not very good for data saving
    loader: async ({ params, context: { queryClient, user } }) => {
        const { award, challenge } = params
        const data = await queryClient.ensureQueryData(challengeQueryOptions(award, challenge, user.userId))
        if (data && data.proposals?.status !== 'not started') {
            await queryClient.ensureQueryData(proposalQueryOptions(award, challenge, user.userId))
        }
        return data
    }
})

function RouteComponent() {
    const { challenge, award } = Route.useParams()
    return (
        <div className='h-full'>
            <ChallengeShell challenge={challenge}>
                {/* To prevent persistance of form */}
                <div key={`${award}-${challenge}`} className='h-full'>
                    <MainStudentDash />

                </div>
            </ChallengeShell>
        </div>
    )
}
