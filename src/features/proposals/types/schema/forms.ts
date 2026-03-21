import { z } from "zod";

export const CreateProposalSchema = z.object({
    mentorEmail: z.email("Enter a valid mentor email"),
    description: z.string().trim().min(20, "Description must be at least 20 characters").max(1000, "Description must be 1000 characters or less"),
    goal: z.string().trim().min(10, "Goal must be at least 10 characters").max(1000, "Goal must be 1000 characters or less"),
})

export const ReviewProposalFeedbackSchema = z.object({
    feedback: z.string().trim().min(5, "Feedback must be at least 5 characters").max(1000, "Feedback must be 1000 characters or less"),
})
