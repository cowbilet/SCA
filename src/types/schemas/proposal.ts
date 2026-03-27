import { z } from 'zod'
import { awardSchema } from './award'
import { challengeSchema } from './challenges'
import { status } from '@/db/schema'

export const ProposalSchema = z.object({
    award: awardSchema,
    challenge: challengeSchema,
    studentId: z.uuid(),
    mentorEmail: z.email().optional(),
    description: z.string().min(10).max(1000),
    goal: z.string().min(10).max(1000),
    accepted: z.boolean().nullable(),
    assessorNote: z.string().max(1000).nullable(),
    mentorNote: z.string().max(1000).nullable(),
    status: z.enum(status.enumValues),
})
export type Proposal = z.infer<typeof ProposalSchema>
