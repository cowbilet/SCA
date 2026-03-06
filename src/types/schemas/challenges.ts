import { z } from "zod";
import { validateChallenge } from "@/types/guards/challenges";
import { validateAward } from "../guards/awards";
import { ProposalSchema } from "./proposal";
import { Challenge } from "../challenges";
export const StudentChallengeSchema = z.object({
    mentorId: z.uuid(),
    studentId: z.uuid(),
    award: z.string().refine((award): award is string => validateAward(award), {
        message: 'Invalid award',
    }),
    challenge: z.string().refine((challenge): challenge is string => validateChallenge(challenge), {
        message: 'Invalid challenge',
    }),
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