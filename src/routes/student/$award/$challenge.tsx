import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import ChallengeShell from '@/components/student/challenge'
import { challengeSchema } from '@/types/schemas/challenges'
import { challengeQueryOptions, useChallenge } from '@/hooks/useChallenge'
import type { JSX } from 'react'
import { ActiveProposal, SubmitProposal } from '@/features/proposals/components/studentProposal/proposal'
import { SubmissionState } from '@/types/awards'
import { proposalQueryOptions } from '@/features/proposals/hooks/useProposal'
import { ActivityLogs } from '@/features/logs/components/activityLogs'
import { awardSchema } from '@/types/schemas/award'

export const Route = createFileRoute('/student/$award/$challenge')({
    component: () => <RouteComponent />,
    params: z.object({
        award: awardSchema,
        challenge: challengeSchema,
    }),
    shouldReload: false,
    //TODO: If you go to the student page and hover over any page it preloads the data, this is not very good for data saving
    loader: async ({ params, context: { queryClient, user } }) => {
        const { award, challenge } = params
        const data = await queryClient.ensureQueryData(challengeQueryOptions(award, challenge))
        if (data && data.proposals?.status !== 'not started') {
            await queryClient.ensureQueryData(proposalQueryOptions(award, challenge, user.userId))
        }
        return data
    }
})
const proposalComponents: Record<SubmissionState, (props: {proposalStatus: SubmissionState}) => JSX.Element> = {
    'not started': ({proposalStatus}) => <SubmitProposal proposalStatus={proposalStatus} />,
    'withdrawn': ({proposalStatus}) => <ActiveProposal proposalStatus={proposalStatus} />,
    'pending mentor': ({proposalStatus}) => <ActiveProposal proposalStatus={proposalStatus} />,
    'pending assessor': ({proposalStatus}) => <ActiveProposal proposalStatus={proposalStatus} />,
    'rejected mentor': ({proposalStatus}) => <ActiveProposal proposalStatus={proposalStatus} />,
    'rejected assessor': ({proposalStatus}) => <ActiveProposal proposalStatus={proposalStatus} />,
    'completed': () => <ActivityLogs />,
}
function RouteComponent() {
    const { challenge, award } = Route.useParams()
    const { data: challengeData } = useChallenge(award, challenge)
    
    
    return (
        <div className='h-full'>
            <ChallengeShell challenge={challenge}>
                {/* To prevent persistance of form */}
                <div key={`${award}-${challenge}`} className='h-full'>
                    {proposalComponents[challengeData?.proposals?.status ?? 'not started']({proposalStatus: challengeData?.proposals?.status ?? 'not started'})}

                </div>
            </ChallengeShell>
        </div>
    )
}
