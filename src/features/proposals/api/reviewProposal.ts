import { dbChangeProposalStatus } from "@/db/proposals.server";
import { dbGetUserByName } from "@/db/users.server";
import { Award } from "@/types/awards";
import { Challenge } from "@/types/challenges";
import { validateAward } from "@/types/guards/awards";
import { validateChallenge } from "@/types/guards/challenges";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
const submitProposalSchema = z.object({
    award: z.string().refine((award): award is Award => validateAward(award), {
        message: 'Invalid award',
    }),
    challenge: z.string().refine((challenge): challenge is Challenge => validateChallenge(challenge), {
        message: 'Invalid challenge',
    }),
    studentId: z.uuid(),
    //TODO: Get rid of this
    mentorName: z.string(),
    notes: z.string(),
    accepted: z.boolean(),
})
export const reviewProposal = createServerFn().inputValidator(submitProposalSchema).handler(async ({data: {award, challenge, studentId, mentorName, notes, accepted}}) => {
    if (mentorName === "Assessor") {
        const advisor = await dbGetUserByName("Assessor")
        if (!advisor) {
            throw new Error("User not authenticated")
        }
        if (accepted) {
            dbChangeProposalStatus(studentId, award, challenge, "completed", notes, advisor.userId)
        }
        else {
            dbChangeProposalStatus(studentId, award, challenge, "rejected assessor", notes, advisor.userId)
        }
    }
    else if (mentorName === "Mentor") {
        if (accepted) {
            dbChangeProposalStatus(studentId, award, challenge, "pending assessor", notes)
        }
        else {
            dbChangeProposalStatus(studentId, award, challenge, "rejected mentor", notes)
        }
    }
})