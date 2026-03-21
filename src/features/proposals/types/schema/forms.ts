import { z } from "zod";

export const CreateProposalSchema = z.object({
    mentorEmail: z.email("Invalid email address"),
    description: z.string(),
    goal: z.string(),
})
