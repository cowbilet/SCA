import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { StudentChallengeWithProposalAndSubmission } from '@/types/schemas/challenges'

import { dbGetUserChallenge } from '@/db/challenges.server'
import { restrictStudentData } from '@/utils/auth'
import { awardSchema } from '@/types/schemas/award'

import { challengeSchema } from '@/types/schemas/challenges'

const inputSchema = z.object({
    award: awardSchema,
    challenge: challengeSchema,
    studentId: z.uuid(),
})
export const getUserChallenge = createServerFn({ method: 'GET' })
    .inputValidator(inputSchema)
    .handler(
        async ({
            data,
        }): Promise<StudentChallengeWithProposalAndSubmission | null> => {
            const { award, challenge, studentId } = data
            await restrictStudentData({ data: studentId })
            const result = await dbGetUserChallenge(studentId, award, challenge)
            return result
        },
    )
