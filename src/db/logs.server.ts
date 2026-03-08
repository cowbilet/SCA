import { logs } from "./schema";
import { db } from "./index.server";
import type { Award} from "@/types/awards";
import type { Challenge } from "@/types/challenges";
import { and, eq } from "drizzle-orm";
import { LogEntry } from "@/types/schemas/log";
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