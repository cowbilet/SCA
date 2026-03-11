import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { restrictRoles, restrictStudentData } from "@/utils/auth"
import { awardSchema } from "@/types/schemas/award"
import { challengeSchema } from "@/types/schemas/challenges"
import { dbGetStudentAwardLogs } from "@/db/logs.server"
import { LogEntry } from "@/types/schemas/log"
export const getUserLogs = createServerFn({ method: 'GET' }).inputValidator(z.object({
    award: awardSchema,
    challenge: challengeSchema,
    studentId: z.uuid(),
})).handler(async ({data}): Promise<LogEntry[]> => {
    const { award, challenge, studentId } = data
    await restrictStudentData({data: studentId})

    const logs = await dbGetStudentAwardLogs(studentId, award, challenge)
    return logs
})