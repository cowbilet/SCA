import { createServerFn } from "@tanstack/react-start";
import { dbGetMentorPendingProposals } from "@/db/mentors.server";
import { dbGetUserByName } from "@/db/users.server";
import { ProposalWithStudent } from "@/types/schemas/proposal";
import { restrictRoles } from "@/utils/server/auth.server";
export const getMentorPending = createServerFn({ method: 'GET' }).handler(async (): Promise<ProposalWithStudent[]> => {
    const mentor = await restrictRoles({ data: ["mentor"] })
    const pendingProposals = await dbGetMentorPendingProposals(mentor.userId)

    return pendingProposals
})