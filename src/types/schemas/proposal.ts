import { z } from "zod";
import { validateChallenge } from "@/types/guards/challenges";
import { status } from "@/db/schema.server";
import type { Challenge } from "@/types/challenges";
import { validateAward } from "@/types/guards/awards";
import type { Award } from "@/types/awards";
import { UserSchema } from "./users";
export const ProposalSchema = z.object({
    award: z.string().refine((award): award is Award => validateAward(award), {
        message: 'Invalid award',
    }),
    challenge: z.string().refine((challenge): challenge is Challenge => validateChallenge(challenge), {
        message: 'Invalid challenge',
    }),
    studentId: z.uuid(),
    mentorEmail: z.email(),
    description: z.string().min(10).max(1000),
    goal: z.string().min(10).max(1000),
    accepted: z.boolean().nullable(),
    assessorNote: z.string().max(1000).nullable(),
    mentorNote: z.string().max(1000).nullable(),
    status: z.enum(status.enumValues),
})
export const ProposalWithStudentSchema = z.object({
    student: UserSchema,
    proposal: ProposalSchema
})

export type ProposalWithStudent = z.infer<typeof ProposalWithStudentSchema>
export type Proposal = z.infer<typeof ProposalSchema>