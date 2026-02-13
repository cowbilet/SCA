import { challengeProposals } from "@/db/schema.server";
import { db } from "@/db/index.server";
import { Challenge } from "@/types/challenges";
import { Award } from "@/types/awards";

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
