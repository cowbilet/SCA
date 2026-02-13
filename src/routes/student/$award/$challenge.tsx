import { validateChallenge } from '@/types/guards/challenges'
import { Challenge } from '@/types/challenges'
import { createFileRoute } from '@tanstack/react-router'
import ChallengeShell from '@/components/student/challenge'
import {z} from 'zod'
import { getUserAwardChallenges } from '@/api/challenges'
import { challengesQueryOptions } from '@/hooks/useChallenge'

import SubmitProposal from '@/features/proposals/components/studentProposal/submitProposal'
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
        const { challenge, award } = params
        const data = await queryClient.ensureQueryData(challengesQueryOptions(award, (data: Awaited<ReturnType<typeof getUserAwardChallenges>>) => data.find((c) => c.challenge === challenge)))

        return data
    }
})

function RouteComponent() {
    const { challenge } = Route.useParams()
    const challengeData = Route.useLoaderData()

    return (
        <div className='h-full'>
            
            <ChallengeShell challenge={challenge}>
                {!challengeData || !challengeData.length || challengeData[0]["proposalStatus"] === 'completed' ? (
                    <SubmitProposal key={challenge} challenge={challenge} />
                ) : (
                    <div className='p-4 bg-green-100 border border-green-400 text-green-700 rounded'>
                        Challenge Completed!
                    </div>
                )}
            </ChallengeShell>
        </div>
    )
}
