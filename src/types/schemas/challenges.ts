import { z } from 'zod'
import { awardSchema } from './award'
import type { Challenge } from '../challenges'
import { validateChallenge } from '@/types/guards/challenges'
import { status } from '@/db/schema'


export const challengeSchema = z
    .string()
    .refine(
        (challenge): challenge is Challenge => validateChallenge(challenge),
        {
            message: 'Invalid challenge',
        },
    )
export const StudentChallengeSchema = z.object({
    mentorId: z.uuid(),
    stateAssessorId: z.uuid().nullable(),
    nationalAssessorId: z.uuid().nullable(),
    studentId: z.uuid(),
    award: awardSchema,
    challenge: challengeSchema,
    status: z.enum(status.enumValues),
    reflection: z.string().max(1000).nullable(),
    accepted: z.boolean().nullable(),
    mentorNote: z.string().max(1000).nullable(),
    stateAssessorNote: z.string().max(1000).nullable(),
    nationalAssessorNote: z.string().max(1000).nullable(),
})
    export type StudentChallenge = z.infer<typeof StudentChallengeSchema>
