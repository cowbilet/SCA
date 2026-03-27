import { z } from 'zod'

export const CreateProposalSchema = z.object({
    mentorEmail: z.email('Enter a valid mentor email'),
    description: z
        .string()
        .trim()
        .min(1, 'Description is required')
        .max(1000, 'Description must be 1000 characters or less'),
    goal: z
        .string()
        .trim()
        .min(1, 'Goals are required')
        .max(1000, 'Goal must be 1000 characters or less'),
})

export const ReviewProposalFeedbackSchema = z.object({
    feedback: z
        .string()
        .trim()
        .min(1, 'Feedback is required')
        .max(1000, 'Feedback must be 1000 characters or less'),
})
