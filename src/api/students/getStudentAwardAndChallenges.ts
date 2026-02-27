import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { dbGetStudentAwardsAndChallenges } from "@/db/challenges.server";
import { ensureSession, restrictStudentData } from "@/utils/server/auth.server";
import { dbGetMentorStudents } from "@/db/mentors.server";
const getStudentAwardAndChallengesSchema = z.object({
    studentId: z.uuid(),
})
export const getStudentAwardAndChallenges = createServerFn().inputValidator(getStudentAwardAndChallengesSchema).handler(async ({data: {studentId}}) => {
    await restrictStudentData({data: studentId})
    return dbGetStudentAwardsAndChallenges(studentId)
})