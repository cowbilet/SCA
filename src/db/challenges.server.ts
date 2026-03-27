import { and, eq } from 'drizzle-orm/sql/expressions/conditions'
import { db } from './index.server'
import type { Award, SubmissionState } from '@/types/awards'
import type { StudentChallenge } from '@/types/schemas/challenges'
import type { Challenge } from '@/types/challenges'
import { validateStatusTransition } from '@/utils/server/state.server'
import { studentChallenge } from '@/db/schema'

export async function dbGetUserAwardChallenges(
    userId: string,
    award: Award,
): Promise<Array<StudentChallenge>> {
    return await db
        .select()
        .from(studentChallenge)
        .where(
            and(
                eq(studentChallenge.studentId, userId),
                eq(studentChallenge.award, award),
            ),
        )
}
export async function dbGetStudentChallenge(
    userId: string,
    award: Award,
    challenge: Challenge,
): Promise<StudentChallenge | null> {
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

    if (results.length === 0) {
        return null
    }

    return results[0]
}
export function dbGetAllChallenges() {
    return db.select().from(studentChallenge).as('challenges')
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
    status: ProposalTransitionStatus,
    note?: string,
    stateAssessorId?: string,
    nationalAssessorId?: string,
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
            award,
            stateAssessorId,
            nationalAssessorId,
        })
        const challengePatch: typeof basePatch & { reflection?: string } = {
            ...basePatch,
        }
        if (basePatch.status === 'pending mentor' && !note) {
            throw new Error(
                'Reflection is required to set status to pending mentor',
            )
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
