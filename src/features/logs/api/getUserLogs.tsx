import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { restrictRoles } from "@/utils/auth"
import { awardSchema } from "@/types/schemas/award"
import { challengeSchema } from "@/types/schemas/challenges"
import { dbGetStudentAwardLogs } from "@/db/logs.server"
export const getUserLogs = createServerFn({ method: 'GET' }).inputValidator(z.object({
    award: awardSchema,
    challenge: challengeSchema,
    studentId: z.uuid(),
})).handler(async ({data}) => {
    const { award, challenge, studentId } = data
    const user = await restrictRoles({ data: ["student", "mentor", "assessor"] })
    if (user.userId !== studentId) {
        throw new Error("You don't have permission to view these logs")
    }
    const logs = await dbGetStudentAwardLogs(studentId, award, challenge)
    return logs
})