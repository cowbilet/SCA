import { db } from "./index.server";
import { challengeSubmission } from "./schema";
import type { Award } from "@/types/awards";
import type { Challenge } from "@/types/challenges";

export async function dbCreateSubmission(studentId: string, award: Award, challenge: Challenge, reflection: string) {
    await db.insert(challengeSubmission).values({
        studentId,
        award,
        challenge,
        studentReflection: reflection,
    });
}