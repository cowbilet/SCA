import { and, eq } from 'drizzle-orm/sql/expressions/conditions'
import { db } from './index.server'
import { dbGetAllProposals } from './proposals.server'
import type { Award, SubmissionState } from '@/types/awards'
import type { StudentChallengeWithProposalAndSubmission } from '@/types/schemas/challenges'
import type { Challenge } from '@/types/challenges'
import { validateStatusTransition } from '@/utils/server/state.server'
import { studentChallenge } from '@/db/schema'

export async function dbGetUserAwardChallenges(
    userId: string,
    award: Award,
): Promise<Array<StudentChallengeWithProposalAndSubmission>> {
    const challengeProposalsSubquery = dbGetAllProposals()
    return await db
        .select()
        .from(studentChallenge)
        .where(
            and(
                eq(studentChallenge.studentId, userId),
                eq(studentChallenge.award, award),
            ),
        )
        .leftJoin(
            challengeProposalsSubquery,
            eq(
                studentChallenge.challenge,
                challengeProposalsSubquery.challenge,
            ),
        )
}
export async function dbGetUserChallenge(
    userId: string,
    award: Award,
    challenge: Challenge,
): Promise<StudentChallengeWithProposalAndSubmission | null> {
    const challengeProposalsSubquery = dbGetAllProposals()

    const results = await db
        .select()
        .from(studentChallenge)
        .where(
            and(
                eq(studentChallenge.studentId, userId),
                eq(studentChallenge.award, award),
                eq(studentChallenge.challenge, challenge),
            ),
        )
        .leftJoin(
            challengeProposalsSubquery,
            and(
                eq(
                    studentChallenge.challenge,
                    challengeProposalsSubquery.challenge,
                ),
                eq(challengeProposalsSubquery.award, award),
                eq(challengeProposalsSubquery.studentId, userId),
            ),
        )
    if (results.length === 0) {
        return null
    }

    return results[0]
}
export function dbGetAllChallenges() {
    const challengeProposalsSubquery = dbGetAllProposals()
    return db
        .select()
        .from(studentChallenge)
        .leftJoin(
            challengeProposalsSubquery,
            eq(
                studentChallenge.challenge,
                challengeProposalsSubquery.challenge,
            ),
        )
        .as('challenges')
}
export async function dbCreateUserChallenge(
    studentId: string,
    mentorId: string,
    award: Award,
    challenge: Challenge,
) {
    await db.insert(studentChallenge).values({
        studentId,
        mentorId,
        award,
        challenge,
    })
}
export async function dbGetStudentAwardsAndChallenges(
    studentId: string,
): Promise<Array<{ award: Award; challenges: Challenge }>> {
    return await db
        .select({
            award: studentChallenge.award,
            challenges: studentChallenge.challenge,
        })
        .from(studentChallenge)
        .where(eq(studentChallenge.studentId, studentId))
}
type ProposalTransitionStatus = SubmissionState | 'withdrawn'
export async function dbChangeChallengeStatus(
    studentId: string,
    award: Award,
    challenge: Challenge,
    status: 'rejected mentor' | 'pending assessor',
    note: string,
): Promise<void>
export async function dbChangeChallengeStatus(
    studentId: string,
    award: Award,
    challenge: Challenge,
    status: 'completed' | 'rejected assessor',
    note: string,
    assessorId: string,
): Promise<void>
export async function dbChangeChallengeStatus(
    studentId: string,
    award: Award,
    challenge: Challenge,
    status: 'pending mentor',
    note: string,
): Promise<void>
export async function dbChangeChallengeStatus(
    studentId: string,
    award: Award,
    challenge: Challenge,
    status: 'withdrawn',
): Promise<void>
export async function dbChangeChallengeStatus(
    studentId: string,
    award: Award,
    challenge: Challenge,
    status: ProposalTransitionStatus,
    note?: string,
    assessorId?: string,
): Promise<void> {
    await db.transaction(async (tx) => {
        const challengeData = (
            await tx
                .select()
                .from(studentChallenge)
                .where(
                    and(
                        eq(studentChallenge.studentId, studentId),
                        eq(studentChallenge.award, award),
                        eq(studentChallenge.challenge, challenge),
                    ),
                )
                .limit(1)
        )[0]

        const currentStatus = challengeData.status

        if (status === 'not started') {
            throw new Error(
                'Cannot directly set challenge status to not started',
            )
        }

        const basePatch = validateStatusTransition(currentStatus, status, {
            note,
            assessorId,
        })
        const challengePatch: typeof basePatch & { reflection?: string } = {
            ...basePatch,
        }
        if (basePatch.status === 'pending mentor' && !note) {
            throw new Error('Reflection is required to set status to pending mentor')
        } else if (basePatch.status === 'pending mentor' && note) {
            challengePatch.reflection = note
        }

        await tx
            .update(studentChallenge)
            .set(challengePatch)
            .where(
                and(
                    eq(studentChallenge.studentId, studentId),
                    eq(studentChallenge.award, award),
                    eq(studentChallenge.challenge, challenge),
                ),
            )
    })
}
