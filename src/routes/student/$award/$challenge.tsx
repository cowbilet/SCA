import { validateChallenge } from '@/types/guards/challenges'
import { Challenge } from '@/types/challenges'
import { createFileRoute } from '@tanstack/react-router'
import { useParams } from '@tanstack/react-router'
import ChallengeShell from '@/components/student/challenge'
import {z} from 'zod'
const challengeSchema = z.string().refine((challenge): challenge is Challenge => validateChallenge(challenge), {
    message: 'Invalid challenge',
})
export const Route = createFileRoute('/student/$award/$challenge')({
    component: RouteComponent,
    params: {
        parse: (rawParams) => {
            const result = challengeSchema.safeParse(rawParams.challenge)
            if (!result.success) {
                throw new Response('Invalid challenge', { status: 400 })
            }
            return { challenge: result.data }
        }
    }
})

function RouteComponent() {
    const { challenge } = Route.useParams()
    return (
        <div className='flex-1'>
            <ChallengeShell challenge={challenge} />
        </div>
    )
}
