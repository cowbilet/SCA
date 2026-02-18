import { challengeProposals, studentChallenge, users } from "@/db/schema.server";
import { db } from "@/db/index.server";
import { Challenge } from "@/types/challenges";
import { Award, SubmissionState } from "@/types/awards";
import { eq, and, isNull } from "drizzle-orm";
import { Proposal } from "@/types/proposal";

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
export async function editDbChallengeProposal(proposalId: string, description: string, goal: string) {
    return await db.update(challengeProposals).set({
        description,
        goal,
    }).where(eq(challengeProposals.proposalId, proposalId)).returning({ proposalId: challengeProposals.proposalId });
}
export async function getDbChallengeProposal(studentId: string, award: Award, challenge: Challenge): Promise<Proposal[]> {
    const current = await db.select({
        proposalId: challengeProposals.proposalId,
        studentId: challengeProposals.studentId,
        award: challengeProposals.award,
        challenge: challengeProposals.challenge,
        description: challengeProposals.description,
        goal: challengeProposals.goal,
        mentorNote: challengeProposals.mentorNote,
        assessorNote: challengeProposals.assessorNote,
        accepted: challengeProposals.accepted,
        mentorEmail: users.email,
    }).from(challengeProposals)
        .where(and(
            eq(challengeProposals.studentId, studentId),
            eq(challengeProposals.award, award),
            eq(challengeProposals.challenge, challenge),
            // TODO: Assuming that there will only be 1 proposal per challenge per student, but we may want to allow multiple proposals in the future
            // isNull(challengeProposals.accepted),
        )
    ).innerJoin(users, eq(challengeProposals.mentorId, users.userId)).limit(1);
    return current
}
export async function dbChangeProposalStatus(proposalId: string, status: 'rejected mentor' | 'pending assessor' , note?: string): Promise<void>;
export async function dbChangeProposalStatus(proposalId: string, status: 'completed' | 'rejected assessor', note?: string, assessorId?: string): Promise<void>;
export async function dbChangeProposalStatus(proposalId: string, status: 'withdrawn' | 'pending mentor'): Promise<void>;
export async function dbChangeProposalStatus(proposalId: string, status: SubmissionState, note?: string, assessorId?: string): Promise<void> {
    const proposal = (await db.select().from(challengeProposals).where(eq(challengeProposals.proposalId, proposalId)).limit(1))[0]
    const challenge = (await db.select().from(studentChallenge).where(and(
        eq(studentChallenge.studentId, proposal.studentId),
        eq(studentChallenge.award, proposal.award),
        eq(studentChallenge.challenge, proposal.challenge),
    )).limit(1))[0]
    if (!proposal) {
        throw new Error("Proposal not found")
    }
    if (!challenge) {
        throw new Error("Challenge not found for proposal")
    }
    if (status === 'withdrawn') {
        if (challenge.proposalStatus !== 'pending mentor' && challenge.proposalStatus !== 'pending assessor') {
            throw new Error("Only proposals that are pending review can be withdrawn")
        }
        await db.update(challengeProposals).set({
            assessorNote: undefined,
            mentorNote: undefined,
        }).where(eq(challengeProposals.proposalId, proposalId)).returning({ proposalId: challengeProposals.proposalId });
        await db.update(studentChallenge).set({
            proposalStatus: 'withdrawn',
        }).where(and(
            eq(studentChallenge.studentId, proposal.studentId),
            eq(studentChallenge.award, proposal.award),
            eq(studentChallenge.challenge, proposal.challenge),
        )).returning({ studentId: studentChallenge.studentId });
        return
    }
    if (status === 'rejected mentor' || status === 'pending assessor') {
        if (challenge.proposalStatus !== 'pending mentor' && status === 'rejected mentor' 
            || challenge.proposalStatus !== 'pending assessor' && status === 'pending assessor' && (proposal.mentorNote === null && proposal.accepted !== false)) {
            throw new Error("Proposal is not in the correct state for this action")
        }
        await db.update(challengeProposals).set({
            accepted: status === 'pending assessor' ? false : null,
            mentorNote: note,
        }).where(eq(challengeProposals.proposalId, proposalId)).returning({ proposalId: challengeProposals.proposalId });
        await db.update(studentChallenge).set({
            proposalStatus: status,
        }).where(and(
            eq(studentChallenge.studentId, proposal.studentId),
            eq(studentChallenge.award, proposal.award),
            eq(studentChallenge.challenge, proposal.challenge),
        )).returning({ studentId: studentChallenge.studentId });
         return
    }
    if (status === 'rejected assessor') {
        if (challenge.proposalStatus !== 'pending assessor' && status === 'rejected assessor') {
            throw new Error("Proposal is not in the correct state for this action")
        }

        await db.update(challengeProposals).set({
            accepted: false,
            assessorNote: note,
        }).where(eq(challengeProposals.proposalId, proposalId)).returning({ proposalId: challengeProposals.proposalId });
        await db.update(studentChallenge).set({
            proposalStatus: 'rejected assessor',
        }).where(and(
            eq(studentChallenge.studentId, proposal.studentId),
            eq(studentChallenge.award, proposal.award),
            eq(studentChallenge.challenge, proposal.challenge),
        )).returning({ studentId: studentChallenge.studentId });
         return
    }
    if (status === 'completed') {
        if (challenge.proposalStatus !== 'pending assessor' && status === 'completed') {
            throw new Error("Proposal is not in the correct state for completion")
        }
        if (proposal.mentorNote === null) {
            throw new Error("Proposal is not in the correct state for completion")
        }
        await db.update(challengeProposals).set({
            accepted: true,
            assessorNote: note,
        }).where(eq(challengeProposals.proposalId, proposalId)).returning({ proposalId: challengeProposals.proposalId });
        await db.update(studentChallenge).set({
            proposalStatus: 'completed',
        }).where(and(
            eq(studentChallenge.studentId, proposal.studentId),
            eq(studentChallenge.award, proposal.award),
            eq(studentChallenge.challenge, proposal.challenge),
        )).returning({ studentId: studentChallenge.studentId });
    }
    if (status === 'pending mentor') {
        if (challenge.proposalStatus !== 'rejected mentor' && challenge.proposalStatus !== 'withdrawn') {
            throw new Error("Proposal is not in the correct state for resubmission")
        }
        await db.update(studentChallenge).set({
            proposalStatus: 'pending mentor',
        }).where(and(
            eq(studentChallenge.studentId, proposal.studentId),
            eq(studentChallenge.award, proposal.award),
            eq(studentChallenge.challenge, proposal.challenge),
        )).returning({ studentId: studentChallenge.studentId });
    }
}