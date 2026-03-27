import { and, eq } from 'drizzle-orm'
import type { Challenge } from '@/types/challenges'
import type { Award, SubmissionState } from '@/types/awards'
import type { Proposal } from '@/types/schemas/proposal'
import { challengeProposals, users } from '@/db/schema'
import { db } from '@/db/index.server'
import { validateStatusTransition } from '@/utils/server/state.server'

export async function dbGetProposal(
    studentId: string,
    award: Award,
    challenge: Challenge,
): Promise<Proposal | null> {
    const proposal = await db
        .select({
            studentId: challengeProposals.studentId,
            award: challengeProposals.award,
            challenge: challengeProposals.challenge,
            description: challengeProposals.description,
            goal: challengeProposals.goal,
            mentorEmail: users.email,
            mentorNote: challengeProposals.mentorNote,
            assessorNote: challengeProposals.assessorNote,
            accepted: challengeProposals.accepted,
            status: challengeProposals.status,
        })
        .from(challengeProposals)
        .where(
            and(
                eq(challengeProposals.studentId, studentId),
                eq(challengeProposals.award, award),
                eq(challengeProposals.challenge, challenge),
            ),
        )
        .innerJoin(users, eq(challengeProposals.mentorId, users.id))
        .limit(1)

    if (proposal.length === 0) {
        return null
    }

    const result = proposal[0]
    return result
}
export async function dbCreateChallengeProposal(
    studentId: string,
    mentorId: string,
    award: Award,
    challenge: Challenge,
    description: string,
    goal: string,
): Promise<Proposal | null> {
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
    })

    return await dbGetProposal(studentId, award, challenge)
}
export async function dbEditProposal(
    studentId: string,
    award: Award,
    challenge: Challenge,
    description: string,
    goal: string,
): Promise<Proposal | null> {
    await db
        .update(challengeProposals)
        .set({
            description,
            goal,
        })
        .where(
            and(
                eq(challengeProposals.studentId, studentId),
                eq(challengeProposals.award, award),
                eq(challengeProposals.challenge, challenge),
            ),
        )

    return await dbGetProposal(studentId, award, challenge)
}

type ProposalTransitionStatus = SubmissionState | 'withdrawn'

export async function dbChangeProposalStatus(
    studentId: string,
    award: Award,
    challenge: Challenge,
    status: 'rejected mentor' | 'pending assessor',
    note: string,
): Promise<void>
export async function dbChangeProposalStatus(
    studentId: string,
    award: Award,
    challenge: Challenge,
    status: 'completed' | 'rejected assessor',
    note: string,
    assessorId: string,
): Promise<void>
export async function dbChangeProposalStatus(
    studentId: string,
    award: Award,
    challenge: Challenge,
    status: 'withdrawn' | 'pending mentor',
): Promise<void>
export async function dbChangeProposalStatus(
    studentId: string,
    award: Award,
    challenge: Challenge,
    status: ProposalTransitionStatus,
    note?: string,
    assessorId?: string,
): Promise<void> {
    await db.transaction(async (tx) => {
        const proposal = (
            await tx
                .select()
                .from(challengeProposals)
                .where(
                    and(
                        eq(challengeProposals.studentId, studentId),
                        eq(challengeProposals.award, award),
                        eq(challengeProposals.challenge, challenge),
                    ),
                )
                .limit(1)
        )[0]

        const currentStatus = proposal.status

        if (status === 'not started') {
            throw new Error(
                'Cannot directly set proposal status to not started',
            )
        }
        const basePatch = validateStatusTransition(currentStatus, status, {
            note,
            assessorId,
        })
        await tx
            .update(challengeProposals)
            .set(basePatch)
            .where(
                and(
                    eq(challengeProposals.studentId, studentId),
                    eq(challengeProposals.award, award),
                    eq(challengeProposals.challenge, challenge),
                ),
            )
    })
}
