import { Award } from "@/types/awards";
import { studentChallenge } from "@/db/schema";
import { db } from "./index.server";
import { and, eq } from "drizzle-orm/sql/expressions/conditions";
import type { StudentChallengeWithProposalAndSubmission } from "@/types/schemas/challenges";
import { Challenge } from "@/types/challenges";
import { dbGetAllProposals } from "./proposals.server";
export async function dbGetUserAwardChallenges(userId: string, award: Award): Promise<StudentChallengeWithProposalAndSubmission[]> {
    const challengeProposalsSubquery = dbGetAllProposals()
    return await db.select().from(studentChallenge).where(and(
        eq(studentChallenge.studentId, userId),
        eq(studentChallenge.award, award),
    )).leftJoin(challengeProposalsSubquery, eq(studentChallenge.challenge, challengeProposalsSubquery.challenge))
}
export async function dbGetUserChallenge(userId: string, award: Award, challenge: Challenge): Promise<StudentChallengeWithProposalAndSubmission | null> {
    const challengeProposalsSubquery = dbGetAllProposals()

    const results = await db.select().from(studentChallenge).where(and(
        eq(studentChallenge.studentId, userId),
        eq(studentChallenge.award, award),
        eq(studentChallenge.challenge, challenge)
    )).leftJoin(challengeProposalsSubquery, and(
        eq(studentChallenge.challenge, challengeProposalsSubquery.challenge),
        eq(challengeProposalsSubquery.award, award),
        eq(challengeProposalsSubquery.studentId, userId),
    ))
    if (results.length === 0) {
        return null
    }
    return results[0]
    
}
export function dbGetAllChallenges() {
    const challengeProposalsSubquery = dbGetAllProposals()
    return db.select().from(studentChallenge).leftJoin(challengeProposalsSubquery, eq(studentChallenge.challenge, challengeProposalsSubquery.challenge)).as("challenges");
}
export async function dbCreateUserChallenge(studentId: string, mentorId: string, award: Award, challenge: Challenge) {
    await db.insert(studentChallenge).values({
        studentId,
        mentorId,
        award,
        challenge,
    });
}
export async function dbGetStudentAwardsAndChallenges(studentId: string): Promise<{award: Award, challenges: Challenge}[]> {
    return await db.select({
        award: studentChallenge.award,
        challenges: studentChallenge.challenge,
    }).from(studentChallenge).where(eq(studentChallenge.studentId, studentId))
}