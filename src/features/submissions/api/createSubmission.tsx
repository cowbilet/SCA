import { createServerFn } from '@tanstack/react-start'

import { z } from 'zod'


import {
    dbChangeChallengeStatus,
    dbGetStudentChallenge,
} from '@/db/challenges.server'

import { restrictRoles } from '@/utils/auth'
import { awardSchema } from '@/types/schemas/award'
import { challengeSchema } from '@/types/schemas/challenges'

const createSubmissionSchema = z.object({
    note: z.string().min(1),
    award: awardSchema,
    challenge: challengeSchema,
})
export const createSubmission = createServerFn({ method: 'POST' })
    .inputValidator(createSubmissionSchema)
    .handler(async ({ data }) => {
        const student = await restrictRoles({ data: ['student'] })
        const { note, award, challenge } = data
        // Validate mentor email
        const studentId = student.userId

        // See if they already have a challenge created
        const challengeData = await dbGetStudentChallenge(
            studentId,
            award,
            challenge,
        )

        if (challengeData) {
            await dbChangeChallengeStatus(
                studentId,
                award,
                challenge,
                'pending mentor',
                note,
            )
        } else {
            throw new Error('Challenge data not found for user')
        }
    })
