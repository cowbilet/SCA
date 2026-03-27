import { createServerFn } from '@tanstack/react-start'
import type { Proposal } from '@/types/schemas/proposal'
import { dbGetMentorPendingProposals } from '@/db/mentors.server'
import { dbGetAssessorPendingProposals } from '@/db/assessor.server'
import { restrictRoles } from '@/utils/auth'

export const getAdvisorPending = createServerFn({ method: 'GET' }).handler(
    async (): Promise<Array<Proposal>> => {
        const user = await restrictRoles({ data: ['mentor', 'assessor'] })
        if (user.role === 'mentor') {
            const pendingProposals = await dbGetMentorPendingProposals(
                user.userId,
            )

            return pendingProposals
        } else {
            const pendingProposals = await dbGetAssessorPendingProposals(
                user.userId,
            )
            return pendingProposals
        }
    },
)
