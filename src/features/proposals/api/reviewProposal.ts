import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { dbChangeProposalStatus } from '@/db/proposals.server'
import { restrictRoles, restrictStudentData } from '@/utils/auth'
import { awardSchema } from '@/types/schemas/award'
import { challengeSchema } from '@/types/schemas/challenges'

const submitProposalSchema = z.object({
    award: awardSchema,
    challenge: challengeSchema,
    studentId: z.uuid(),
    notes: z.string(),
    accepted: z.boolean(),
})
export const reviewProposal = createServerFn()
    .inputValidator(submitProposalSchema)
    .handler(
        async ({ data: { award, challenge, studentId, notes, accepted } }) => {
            await restrictRoles({ data: ['assessor', 'mentor'] })
            const user = await restrictStudentData({ data: studentId })

            if (user.role === 'assessor') {
                if (user.state === 'NAT') {
                    if (accepted) {
                        return await dbChangeProposalStatus(
                            studentId,
                            award,
                            challenge,
                            'completed',
                            notes,
                            undefined,
                            user.userId,
                        )
                    }

                    return await dbChangeProposalStatus(
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
                    return await dbChangeProposalStatus(
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
                    return await dbChangeProposalStatus(
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
                    return await dbChangeProposalStatus(
                        studentId,
                        award,
                        challenge,
                        'pending state assessor',
                        notes,
                    )
                } else {
                    return await dbChangeProposalStatus(
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
