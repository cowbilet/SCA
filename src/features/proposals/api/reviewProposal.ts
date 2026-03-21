import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Award } from "@/types/awards";
import type { Challenge } from "@/types/challenges";
import { dbChangeProposalStatus } from "@/db/proposals.server";
import { validateAward } from "@/types/guards/awards";
import { validateChallenge } from "@/types/guards/challenges";
import { restrictRoles } from "@/utils/auth";

const submitProposalSchema = z.object({
    award: z.string().refine((award): award is Award => validateAward(award), {
        message: 'Invalid award',
    }),
    challenge: z.string().refine((challenge): challenge is Challenge => validateChallenge(challenge), {
        message: 'Invalid challenge',
    }),
    studentId: z.uuid(),
    // TODO: Get rid of this
    notes: z.string(),
    accepted: z.boolean(),
})
export const reviewProposal = createServerFn().inputValidator(submitProposalSchema).handler(async ({data: {award, challenge, studentId, notes, accepted}}) => {
    const user = await restrictRoles({ data: ["mentor", "assessor"] })
    if (user.role === "assessor") {
        if (accepted) {
            return await dbChangeProposalStatus(studentId, award, challenge, "completed", notes, user.userId)
        }
        else {
            return await dbChangeProposalStatus(studentId, award, challenge, "rejected assessor", notes, user.userId)
        }
    }
    else if (user.role === "mentor") {
        if (accepted) {
            return await dbChangeProposalStatus(studentId, award, challenge, "pending assessor", notes)
        }
        else {
            return await dbChangeProposalStatus(studentId, award, challenge, "rejected mentor", notes)
        }
    }
})