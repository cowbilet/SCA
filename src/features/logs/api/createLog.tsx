import { z } from "zod"
import { createServerFn } from "@tanstack/react-start"
import { restrictRoles } from "@/utils/server/auth.server"
import { dbCreateLogEntry } from "@/db/logs.server"
import { challengeSchema } from "@/types/schemas/challenges"
import { awardSchema } from "@/types/schemas/award"
import { dbGetUserChallenge } from "@/db/challenges.server"
export const createLog = createServerFn({ method: 'POST' }).inputValidator(z.object({
    award: awardSchema,
    challenge: challengeSchema,
    description: z.string().min(1),
    date: z.coerce.date(),
})).handler(async ({data}) => {
    const { award, challenge, description, date } = data
    const student = await restrictRoles({ data: ["student"] })
    const challengeData = await dbGetUserChallenge(student.userId, award, challenge)
    if (!challengeData || challengeData.proposals?.status !== 'completed') {
        throw new Error("You don't have a proposal for this challenge")
    }
    const logEntry = await dbCreateLogEntry(student.userId, award, challenge, date, description)
    if (!logEntry) {
        throw new Error("Failed to create log entry")
    }
    return logEntry
})