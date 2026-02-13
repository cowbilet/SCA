import { z } from "zod";
export const CreateProposalSchema = z.object({
    mentorEmail: z.email("Invalid email address"),
    description: z.string().min(20, "Description must be at least 20 characters long"),
    goal: z.string().min(10, "Goal must be at least 10 characters long"),
})
