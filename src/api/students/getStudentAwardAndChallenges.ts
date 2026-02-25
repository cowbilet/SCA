import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { dbGetStudentAwardsAndChallenges } from "@/db/challenges.server";
const getStudentAwardAndChallengesSchema = z.object({
    studentId: z.uuid(),
})
export const getStudentAwardAndChallenges = createServerFn().inputValidator(getStudentAwardAndChallengesSchema).handler(async ({data: {studentId}}) => {
    return dbGetStudentAwardsAndChallenges(studentId)
})