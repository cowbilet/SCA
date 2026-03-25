import { createServerFn } from '@tanstack/react-start'

import { z } from 'zod'

import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'
import { validateAward } from '@/types/guards/awards'

import { validateChallenge } from '@/types/guards/challenges'

import {
    dbChangeChallengeStatus,
    dbGetUserChallenge,
} from '@/db/challenges.server'

import { restrictRoles } from '@/utils/auth'

const createSubmissionSchema = z.object({
    note: z.string().min(1),
    award: z
        .string()
        .refine((award): award is Award => validateAward(award), {
            message: 'Invalid award',
        })
        .optional(),
    challenge: z
        .string()
        .refine(
            (challenge): challenge is Challenge => validateChallenge(challenge),
            {
                message: 'Invalid challenge',
            },
        )
        .optional(),
})
export const createSubmission = createServerFn({ method: 'POST' })
    .inputValidator(createSubmissionSchema)
    .handler(async ({ data }) => {
        if (!data.award || !data.challenge) {
            throw new Error('Award and challenge must be provided')
        }
        const student = await restrictRoles({ data: ['student'] })
        const { note, award, challenge } = data
        // Validate mentor email
        const studentId = student.userId
        
        // See if they already have a challenge created
        const challengeData = await dbGetUserChallenge(
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
