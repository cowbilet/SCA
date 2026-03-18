import { and, eq } from "drizzle-orm";
import { logs } from "./schema";
import { db } from "./index.server";
import type { Award} from "@/types/awards";
import type { Challenge } from "@/types/challenges";

export async function dbGetStudentAwardLogs(studentId: string, award: Award, challenge: Challenge) {
    return await db.select().from(logs).where((log) => and(eq( log.studentId, studentId), eq(log.award, award), eq(log.challenge, challenge)))
}
export async function dbCreateLogEntry(studentId: string, award: Award, challenge: Challenge, date: Date, description: string, evidence: string) {
    const logEntry = await db.insert(logs).values({
        studentId,
        award,
        challenge,
        date: date.toISOString(),
        description,
        evidence,
    }).returning()
    if (logEntry.length === 0) {
        return null
    }
    return logEntry[0]
}
export async function dbGetLogEntry(logId: string) {
    const logEntry = await db.select().from(logs).where(eq(logs.logId, logId))
    if (logEntry.length === 0) {
        return null
    }
    return logEntry[0]
}
export async function dbEditLogEntry(logId: string, date: Date, description: string) {
    const updatedLog = await db.update(logs).set({ date: date.toISOString(), description }).where(eq(logs.logId, logId)).returning()
    if (updatedLog.length === 0) {
        return null
    }
    return updatedLog[0]
}
export async function dbApproveLogEntry(logId: string, approved: boolean, feedback: string | null) {
    const updatedLog = await db.update(logs).set({ approved, feedback }).where(eq(logs.logId, logId)).returning()
    if (updatedLog.length === 0) {
        return null
    }
    return updatedLog[0]
}