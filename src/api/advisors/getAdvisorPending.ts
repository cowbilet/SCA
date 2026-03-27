import { createServerFn } from '@tanstack/react-start'
import { dbGetMentorPending } from '@/db/mentors.server'
import { dbGetAssessorPending } from '@/db/assessor.server'
import { restrictRoles } from '@/utils/auth'

export const getAdvisorPending = createServerFn({ method: 'GET' }).handler(
    async () => {
        const user = await restrictRoles({ data: ['mentor', 'assessor'] })
        if (user.role === 'mentor') {
            return await dbGetMentorPending(
                user.userId,
            )
        } else {
            return await dbGetAssessorPending(
                user.userId,
            )
        }
    },
)
