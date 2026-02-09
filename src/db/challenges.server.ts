import { Awards } from "@/types/awards";
import { studentChallenge, challengeProposals, challengeSubmission } from "@/db/schema.server";
import { db } from "./index.server";
import { and, eq } from "drizzle-orm/sql/expressions/conditions";
import { StudentChallenge } from "@/types/schemas/challenges";
export async function getDbUserAwardChallenges(userId: string, award: Awards, userType: "student"): Promise<StudentChallenge[]> {
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
    const challenges: StudentChallenge[] = rawChallenges.map(challenge => ({
        award: challenge.award,
        challenge: challenge.challenge,
        proposalStatus: challenge.proposalStatus,
        submissionStatus: challenge.submissionStatus,
        proposalIds: proposals,
        submissionIds: submissions,
    }))
    return challenges;
}
