import { validateChallenge } from '@/types/guards/challenges'
import { Challenge } from '@/types/challenges'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import ChallengeShell from '@/components/student/challenge'
import {z} from 'zod'
import { challengeQueryOptions, useChallenge } from '@/hooks/useChallenge'
import type { JSX } from 'react'
import { ActiveProposal, SubmitProposal } from '@/features/proposals/components/studentProposal/proposal'
import { SubmissionState } from '@/types/awards'
import { proposalQueryOptions } from '@/features/proposals/hooks/useProposal'
import { ActivityLogs } from '@/features/logs/components/activityLogs'
const challengeSchema = z.string().refine((challenge): challenge is Challenge => validateChallenge(challenge), {
    message: 'Invalid challenge',
})
export const Route = createFileRoute('/student/$award/$challenge')({
    component: () => <RouteComponent />,
    params: {
        parse: (rawParams) => {
            const result = challengeSchema.safeParse(rawParams.challenge)
            if (!result.success) {
                throw new Response('Invalid challenge', { status: 400 })
            }
            return { challenge: result.data }
        }
    },
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
    'completed': ({proposalStatus}) => <ActivityLogs />,
}
function RouteComponent() {
    const { challenge, award } = Route.useParams()
    const {data: challengeData} = useChallenge(award, challenge)
    
    
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
