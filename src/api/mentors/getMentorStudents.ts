import { createServerFn } from "@tanstack/react-start";
import { dbGetMentorPendingProposals, dbGetMentorStudents } from "@/db/mentors.server";
import { dbGetUserByName } from "@/db/users.server";
import { ProposalWithStudent } from "@/types/schemas/proposal";
import { restrictRoles } from "@/utils/server/auth.server";
import { User } from "@/types/schemas/users";
export const getMentorStudents = createServerFn({ method: 'GET' }).handler(async (): Promise<User[]> => {
    const mentor = await restrictRoles({ data: ["mentor"] })
    const students = await dbGetMentorStudents(mentor.userId)
    return students
})