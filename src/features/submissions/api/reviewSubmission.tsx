import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { dbChangeChallengeStatus } from '@/db/challenges.server'

import { restrictRoles, restrictStudentData } from '@/utils/auth'
import { challengeSchema } from '@/types/schemas/challenges'
import { awardSchema } from '@/types/schemas/award'

const reviewSubmissionSchema = z.object({
    award: awardSchema,
    challenge: challengeSchema,
    studentId: z.uuid(),
    notes: z.string(),
    accepted: z.boolean(),
})
// TODO: Make the review more generic for the proposal and stuff
export const reviewSubmission = createServerFn()
    .inputValidator(reviewSubmissionSchema)
    .handler(
        async ({ data: { award, challenge, studentId, notes, accepted } }) => {
            await restrictRoles({ data: ['assessor', 'mentor'] })
            const user = await restrictStudentData({ data: studentId })

            if (user.role === 'assessor') {
                if (user.state === 'NAT') {
                    if (accepted) {
                        return await dbChangeChallengeStatus(
                            studentId,
                            award,
                            challenge,
                            'completed',
                            notes,
                            undefined,
                            user.userId,
                        )
                    }

                    return await dbChangeChallengeStatus(
                        studentId,
                        award,
                        challenge,
                        'rejected national assessor',
                        notes,
                        undefined,
                        user.userId,
                    )
                }

                if (accepted) {
                    return await dbChangeChallengeStatus(
                        studentId,
                        award,
                        challenge,
                        award === 'gold'
                            ? 'pending national assessor'
                            : 'completed',
                        notes,
                        user.userId,
                    )
                } else {
                    return await dbChangeChallengeStatus(
                        studentId,
                        award,
                        challenge,
                        'rejected state assessor',
                        notes,
                        user.userId,
                    )
                }
            } else if (user.role === 'mentor') {
                if (accepted) {
                    return await dbChangeChallengeStatus(
                        studentId,
                        award,
                        challenge,
                        'pending state assessor',
                        notes,
                    )
                } else {
                    return await dbChangeChallengeStatus(
                        studentId,
                        award,
                        challenge,
                        'rejected mentor',
                        notes,
                    )
                }
            }
        },
    )
