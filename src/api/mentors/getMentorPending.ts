import { createServerFn } from "@tanstack/react-start";
import { dbGetMentorPendingProposals } from "@/db/mentors.server";
import { dbGetUserByName } from "@/db/users.server";
import { ProposalWithStudent } from "@/types/schemas/proposal";
export const getMentorPending = createServerFn({ method: 'GET' }).handler(async (): Promise<ProposalWithStudent[]> => {
    const mentor = await dbGetUserByName("Mentor")
    if (!mentor) {
        throw new Error("User not authenticated")
    }
    const pendingProposals = await dbGetMentorPendingProposals(mentor.userId)

    return pendingProposals
})