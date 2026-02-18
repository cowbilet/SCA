import { validateChallenge } from '@/types/guards/challenges'
import { Challenge } from '@/types/challenges'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import ChallengeShell from '@/components/student/challenge'
import {z} from 'zod'
import { challengeQueryOptions } from '@/hooks/useChallenge'
import type { JSX } from 'react'
import ViewProposal from '@/features/proposals/components/studentProposal/viewProposal'
import SubmitProposal from '@/features/proposals/components/studentProposal/submitProposal'
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
        if (data && data['proposalStatus'] === 'not started') {
            await queryClient.ensureQueryData(proposalQueryOptions(award, challenge))
        }
        return data
    }
})
const proposalComponents: Record<SubmissionState, (props: {proposalStatus: SubmissionState}) => JSX.Element> = {
    'not started': ({proposalStatus}) => <SubmitProposal proposalStatus={proposalStatus} />,

    'pending mentor': ({proposalStatus}) => <ViewProposal proposalStatus={proposalStatus} />,
    'pending assessor': ({proposalStatus}) => <div className='p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded'>Your proposal has been approved by your mentor and is now pending review by the assessor.</div>,
    'rejected mentor': ({proposalStatus}) => <div className='p-4 bg-red-100 border border-red-400 text-red-700 rounded'>Your proposal has been rejected. Please review the feedback from your mentor and submit a new proposal.</div>,
    'rejected assessor': ({proposalStatus}) => <div className='p-4 bg-red-100 border border-red-400 text-red-700 rounded'>Your proposal has been rejected by the assessor. Please review the feedback and submit a new proposal.</div>,
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
