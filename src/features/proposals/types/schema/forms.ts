import { z } from "zod";
export const CreateProposalSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long"),
    mentorEmail: z.email("Invalid email address"),
    description: z.string().min(20, "Description must be at least 20 characters long"),
    goals: z.string().min(10, "Goals must be at least 10 characters long"),
})
