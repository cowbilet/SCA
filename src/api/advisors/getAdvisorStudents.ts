import { createServerFn } from "@tanstack/react-start";
import type { User } from "@/types/schemas/users";
import { dbGetMentorPendingProposals, dbGetMentorStudents } from "@/db/mentors.server";

import { restrictRoles } from "@/utils/auth";
import { dbGetAssessorStudents } from "@/db/assessor.server";

export const getAdvisorStudents = createServerFn({ method: 'GET' }).handler(async (): Promise<Array<User>> => {
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