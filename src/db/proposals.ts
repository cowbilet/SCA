import { challengeProposals } from "@/db/schema.server";
import { db } from "@/db/index.server";
import { Challenge } from "@/types/challenges";
import { Award } from "@/types/awards";
import { eq, and, isNull } from "drizzle-orm";

export async function createDbChallengeProposal(studentId: string, mentorId: string, award: Award, challenge: Challenge, description: string, goal: string) {
    return await db.insert(challengeProposals).values({
        challenge,
        studentId,
        award,
        description,
        goal,
        mentorId
    }).returning({ proposalId: challengeProposals.proposalId });
}
export async function getDbChallengeProposal(studentId: string, award: Award, challenge: Challenge) {
    return await db.select().from(challengeProposals)
        .where(and(
            eq(challengeProposals.studentId, studentId),
            eq(challengeProposals.award, award),
            eq(challengeProposals.challenge, challenge),
            isNull(challengeProposals.accepted),
        )).limit(1);
}