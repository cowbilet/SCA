import { z } from "zod";
import { validateAward } from "../guards/awards";
import { ProposalSchema } from "./proposal";
import type { Challenge } from "../challenges";
import { validateChallenge } from "@/types/guards/challenges";
import { status } from "@/db/schema";

export const StudentChallengeSchema = z.object({
    mentorId: z.uuid(),
    assessorId: z.uuid().nullable(),
    studentId: z.uuid(),
    award: z.string().refine((award): award is string => validateAward(award), {
        message: 'Invalid award',
    }),
    challenge: z.string().refine((challenge): challenge is string => validateChallenge(challenge), {
        message: 'Invalid challenge',
    }),
    status: z.enum(status.enumValues),
    accepted: z.boolean().nullable(),
    mentorNote: z.string().max(1000).nullable(),
    assessorNote: z.string().max(1000).nullable(),
})
export const StudentChallengeWithProposalAndSubmissionSchema = z.object({
    student_challenge: StudentChallengeSchema,
    proposals: ProposalSchema.nullable(),
    // submissionStatus: null,
})
export const challengeSchema = z.string().refine((challenge): challenge is Challenge => validateChallenge(challenge), {
    message: 'Invalid challenge',
})
export type StudentChallengeWithProposalAndSubmission = z.infer<typeof StudentChallengeWithProposalAndSubmissionSchema>
export type StudentChallenge = z.infer<typeof StudentChallengeSchema>