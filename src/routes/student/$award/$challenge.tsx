import { validateChallenge } from '@/types/guards/challenges'
import { Challenge } from '@/types/challenges'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import ChallengeShell from '@/components/student/challenge'
import {z} from 'zod'
import { challengeQueryOptions } from '@/hooks/useChallenge'
import type { JSX } from 'react'
import { ActiveProposal, SubmitProposal } from '@/features/proposals/components/studentProposal/proposal'
import { SubmissionState } from '@/types/awards'
import { proposalQueryOptions } from '@/features/proposals/hooks/useProposal'
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
    loader: async ({ params, context: { queryClient } }) => {
        const { award, challenge } = params
        const data = await queryClient.ensureQueryData(challengeQueryOptions(award, challenge))
        if (data && data['proposalStatus'] !== 'not started') {
            await queryClient.ensureQueryData(proposalQueryOptions(award, challenge))
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
    'completed': ({proposalStatus}) => <div className='p-4 bg-green-100 border border-green-400 text-green-700 rounded'>Your proposal has been approved! You can now start logging activities for this challenge.</div>,
}
function RouteComponent() {
    const { challenge } = Route.useParams()
    const challengeData = Route.useLoaderData()
    
    
    return (
        <div className='h-full'>
            <ChallengeShell challenge={challenge}>
                {proposalComponents[challengeData?.proposalStatus ?? 'not started']({proposalStatus: challengeData?.proposalStatus ?? 'not started'})}
            </ChallengeShell>
        </div>
    )
}
