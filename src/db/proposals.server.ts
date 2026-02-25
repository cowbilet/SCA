import { challengeProposals, users } from "@/db/schema.server";
import { db } from "@/db/index.server";
import { Challenge } from "@/types/challenges";
import { Award, SubmissionState } from "@/types/awards";
import { eq, and } from "drizzle-orm";
import { Proposal } from "@/types/schemas/proposal";
import { determineState } from "@/utils/state.server";

export function dbGetAllProposals() {
    return db.select({
        studentId: challengeProposals.studentId,
        award: challengeProposals.award,
        challenge: challengeProposals.challenge,
        description: challengeProposals.description,
        goal: challengeProposals.goal,
        mentorNote: challengeProposals.mentorNote,
        assessorNote: challengeProposals.assessorNote,
        accepted: challengeProposals.accepted,
        mentorEmail: users.email,
        status: challengeProposals.status,
    }).from(challengeProposals).innerJoin(users, eq(challengeProposals.mentorId, users.userId)).as("proposals");
}
export async function dbGetProposal(studentId: string, award: Award, challenge: Challenge): Promise<Proposal | null> {
    const proposal = await db.select({
        studentId: challengeProposals.studentId,
        award: challengeProposals.award,
        challenge: challengeProposals.challenge,
        description: challengeProposals.description,
        goal: challengeProposals.goal,
        mentorNote: challengeProposals.mentorNote,
        assessorNote: challengeProposals.assessorNote,
        accepted: challengeProposals.accepted,
        mentorEmail: users.email,
        status: challengeProposals.status,
    }).from(challengeProposals)
        .where(and(
            eq(challengeProposals.studentId, studentId),
            eq(challengeProposals.award, award),
            eq(challengeProposals.challenge, challenge),
        )
    ).innerJoin(users, eq(challengeProposals.mentorId, users.userId)).limit(1);

    if (proposal.length === 0) {
        return null;
    }

    const result = proposal[0];
    return result
}
export async function dbCreateChallengeProposal(studentId: string, mentorId: string, award: Award, challenge: Challenge, description: string, goal: string): Promise<Proposal | null> {
    await db.insert(challengeProposals).values({
        challenge,
        studentId,
        award,
        description,
        goal,
        mentorId,
        status: 'pending mentor',
        accepted: null,
        mentorNote: null,
        assessorNote: null,
    });
    
    return await dbGetProposal(studentId, award, challenge)
}
export async function dbEditProposal(studentId: string, award: Award, challenge: Challenge, description: string, goal: string): Promise<Proposal | null> {
    await db.update(challengeProposals).set({
        description,
        goal,
    }).where(and(
        eq(challengeProposals.studentId, studentId),
        eq(challengeProposals.award, award),
        eq(challengeProposals.challenge, challenge),
    ));

    return await dbGetProposal(studentId, award, challenge)
}

type ProposalTransitionStatus = SubmissionState | 'withdrawn';

export async function dbChangeProposalStatus(
    studentId: string,
    award: Award,
    challenge: Challenge,
    status: 'rejected mentor' | 'pending assessor',
    note: string,
): Promise<void>;
export async function dbChangeProposalStatus(
    studentId: string,
    award: Award,
    challenge: Challenge,
    status: 'completed' | 'rejected assessor',
    note: string,
    assessorId: string,
): Promise<void>;
export async function dbChangeProposalStatus(
    studentId: string,
    award: Award,
    challenge: Challenge,
    status: 'withdrawn' | 'pending mentor',
): Promise<void>;
export async function dbChangeProposalStatus(
    studentId: string,
    award: Award,
    challenge: Challenge,
    status: ProposalTransitionStatus,
    note?: string,
    assessorId?: string,
): Promise<void> {
    await db.transaction(async (tx) => {
        const proposal = (await tx
            .select()
            .from(challengeProposals)
            .where(and(
                eq(challengeProposals.studentId, studentId),
                eq(challengeProposals.award, award),
                eq(challengeProposals.challenge, challenge),
            ))
            .limit(1))[0];

        if (!proposal) {
            throw new Error("Proposal not found");
        }

        const currentStatus = proposal.status ?? determineState({
            accepted: proposal.accepted,
            mentorNote: proposal.mentorNote ?? undefined,
            assessorNote: proposal.assessorNote ?? undefined,
        });

        if (status === 'not started') {
            throw new Error("Cannot directly set proposal status to not started");
        }

        const nextStatus: SubmissionState = status === 'withdrawn' ? 'not started' : status;
        const validTransitions: Record<SubmissionState, SubmissionState[]> = {
            'not started': ['pending mentor'],
            'pending mentor': ['rejected mentor', 'pending assessor', 'not started'],
            'rejected mentor': ['pending mentor', 'not started'],
            'withdrawn': ['pending mentor', 'not started'], // Treat withdrawn as a special case that can transition back to pending mentor or not started
            'pending assessor': ['rejected assessor', 'completed', 'not started'],
            'rejected assessor': ['pending mentor', 'not started'],
            'completed': [],
        };

        if (!validTransitions[currentStatus].includes(nextStatus)) {
            throw new Error(`Invalid proposal status transition: ${currentStatus} -> ${status}`);
        }

        if (nextStatus === 'pending assessor' && !note?.trim()) {
            throw new Error("Mentor note is required before sending to assessor");
        }

        if ((nextStatus === 'rejected assessor' || nextStatus === 'completed') && !assessorId) {
            throw new Error("Assessor id is required for assessor decision");
        }

        if ((nextStatus === 'rejected assessor' || nextStatus === 'completed') && currentStatus !== 'pending assessor') {
            throw new Error("Only proposals pending assessor review can be assessed");
        }

        const basePatch = {
            status: nextStatus,
        } as {
            status: SubmissionState;
            accepted?: boolean | null;
            mentorNote?: string | null;
            assessorNote?: string | null;
            assessorId?: string | null;
        };

        if (nextStatus === 'pending mentor') {
            basePatch.accepted = null;
            basePatch.mentorNote = null;
            basePatch.assessorNote = null;
            basePatch.assessorId = null;
        } else if (nextStatus === 'rejected mentor') {
            basePatch.accepted = false;
            basePatch.mentorNote = note ?? null;
            basePatch.assessorNote = null;
            basePatch.assessorId = null;
        } else if (nextStatus === 'pending assessor') {
            basePatch.accepted = null;
            basePatch.mentorNote = note ?? proposal.mentorNote ?? null;
            basePatch.assessorNote = null;
            basePatch.assessorId = null;
        } else if (nextStatus === 'rejected assessor') {
            basePatch.accepted = false;
            basePatch.assessorNote = note ?? null;
            basePatch.assessorId = assessorId ?? null;
        } else if (nextStatus === 'completed') {
            basePatch.accepted = true;
            basePatch.assessorNote = note ?? null;
            basePatch.assessorId = assessorId ?? null;
        } else if (nextStatus === 'not started') {
            basePatch.accepted = null;
            basePatch.mentorNote = null;
            basePatch.assessorNote = null;
            basePatch.assessorId = null;
        } else if (nextStatus === 'withdrawn') {
            basePatch.accepted = null;
            basePatch.mentorNote = null;
            basePatch.assessorNote = null;
            basePatch.assessorId = null;
        }

        await tx.update(challengeProposals).set(basePatch).where(and(
            eq(challengeProposals.studentId, studentId),
            eq(challengeProposals.award, award),
            eq(challengeProposals.challenge, challenge),
        ));
    });
}