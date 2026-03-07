import { logs } from "./schema.server";
import { db } from "./index.server";
import type { Award} from "@/types/awards";
import type { Challenge } from "@/types/challenges";
import { and, eq } from "drizzle-orm";
export async function dbGetStudentAwardLogs(studentId: string, award: Award, challenge: Challenge) {
    return await db.select().from(logs).where((log) => and(eq( log.studentId, studentId), eq(log.award, award), eq(log.challenge, challenge)))
}
export async function dbCreateLogEntry(studentId: string, award: Award, challenge: Challenge, date: Date, description: string) {
    return await db.insert(logs).values({
        studentId,
        award,
        challenge,
        date: date.toISOString(),
        description,
    }).returning()
}