import { z } from "zod";
import { validateChallenge } from "@/types/guards/challenges";
import { status } from "@/db/schema.server";
import { validateAward } from "../guards/awards";
export const StudentChallengeSchema = z.object({
    award: z.string().refine((award) => validateAward(award), {
        message: 'Invalid award',
    }),
    challenge: z.string().refine((challenge) => validateChallenge(challenge), {
        message: 'Invalid challenge',
    }),
    proposalStatus: z.string().refine((state): state is typeof status.enumValues[number] => status.enumValues.includes(state as typeof status.enumValues[number]), {
        message: 'Invalid proposal status',
    }),
    submissionStatus: z.string().refine((state): state is typeof status.enumValues[number] => status.enumValues.includes(state as typeof status.enumValues[number]), {
        message: 'Invalid submission status',
    }),
    proposalIds: z.array(z.uuid()).optional(),
    submissionIds: z.array(z.uuid()).optional(),
})
export type StudentChallengeSchema = z.infer<typeof StudentChallengeSchema>