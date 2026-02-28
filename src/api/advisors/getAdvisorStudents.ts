import { createServerFn } from "@tanstack/react-start";
import { dbGetMentorPendingProposals, dbGetMentorStudents } from "@/db/mentors.server";
import { dbGetUserByName } from "@/db/users.server";
import { ProposalWithStudent } from "@/types/schemas/proposal";
import { restrictRoles } from "@/utils/server/auth.server";
import { User } from "@/types/schemas/users";
import { dbGetAssessorStudents } from "@/db/assessor.server";
export const getAdvisorStudents = createServerFn({ method: 'GET' }).handler(async (): Promise<User[]> => {
    const mentor = await restrictRoles({ data: ["mentor", "assessor"] })
    if (mentor.role === "mentor") {
        const students = await dbGetMentorStudents(mentor.userId)
        return students
    }
    else {
        const students = await dbGetAssessorStudents(mentor.userId)
        return students
    }
})