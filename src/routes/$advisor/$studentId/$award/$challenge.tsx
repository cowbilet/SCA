import { createFileRoute } from '@tanstack/react-router'

import z from 'zod'
import MainAdvisorStudentDash from '@/features/dashboard/components/advisor/mainAdvisorStudentDash'
import { awardSchema } from '@/types/schemas/award'
import { challengeSchema } from '@/types/schemas/challenges'
import { challengeQueryOptions } from '@/hooks/useChallenge'

const inputSchema = z.object({
    award: awardSchema,
    challenge: challengeSchema,
    studentId: z.uuid(),
})
export const Route = createFileRoute('/$advisor/$studentId/$award/$challenge')({
    component: RouteComponent,
    params: inputSchema,
    loader: async ({ params, context: { queryClient } }) => {
        const { award, challenge, studentId } = params
        await queryClient.ensureQueryData(
            challengeQueryOptions(award, challenge, studentId),
        )
    },
})

function RouteComponent() {
    return <MainAdvisorStudentDash />
}
