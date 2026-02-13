import { Award, SubmissionState } from "@/types/awards";
import { studentChallenge, challengeProposals, challengeSubmission } from "@/db/schema.server";
import { db } from "./index.server";
import { and, eq } from "drizzle-orm/sql/expressions/conditions";
import type { StudentChallengeSchema } from "@/types/schemas/challenges";
import { Challenge } from "@/types/challenges";
export async function getDbUserAwardChallenges(userId: string, award: Award, userType: "student"): Promise<StudentChallengeSchema[]> {
    const rawChallenges = await db.select({
        award: studentChallenge.award,
        challenge: studentChallenge.challenge,
        proposalStatus: studentChallenge.proposalStatus,
        submissionStatus: studentChallenge.submissionStatus,
    }).from(studentChallenge).where(and(
        eq(studentChallenge.studentId, userId),
        eq(studentChallenge.award, award)
    ))

    const proposals = (await db.select({ proposalId: challengeProposals.proposalId }).from(challengeProposals).where(eq(challengeProposals.studentId, userId))).map(p => p.proposalId);
    const submissions = (await db.select({ submissionId: challengeSubmission.submissionId }).from(challengeSubmission).where(eq(challengeSubmission.studentId, userId))).map(s => s.submissionId);
    const challenges: StudentChallengeSchema[] = rawChallenges.map(challenge => ({
        award: challenge.award,
        challenge: challenge.challenge,
        proposalStatus: challenge.proposalStatus,
        submissionStatus: challenge.submissionStatus,
        proposalIds: proposals,
        submissionIds: submissions,
    }))
    return challenges;
}
export async function getDbUserChallenge(userId: string, award: Award, challenge: Challenge) {
    return await db.select().from(studentChallenge).where(and(
        eq(studentChallenge.studentId, userId),
        eq(studentChallenge.award, award),
        eq(studentChallenge.challenge, challenge)
    ))
    
}
export async function editDbUserChallenge(studentId: string, award: Award, challenge: Challenge, proposalStatus?: SubmissionState, submissionStatus?: SubmissionState) {
    await db.update(studentChallenge).set({
        proposalStatus,
        submissionStatus,
    }).where(and(
        eq(studentChallenge.studentId, studentId),
        eq(studentChallenge.award, award),
        eq(studentChallenge.challenge, challenge)
    ))
}
export async function createDbUserAwardChallenge(studentId: string, mentorId: string, award: Award, challenge: Challenge, proposalStatus: SubmissionState = "not started", submissionStatus: SubmissionState = "not started") {
    await db.insert(studentChallenge).values({
        studentId,
        mentorId,
        award,
        challenge,
        proposalStatus,
        submissionStatus,
    });
}