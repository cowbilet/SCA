import { and, eq } from 'drizzle-orm/sql/expressions/conditions'
import { sql } from 'drizzle-orm/sql'
import { db } from './index.server'

import { assessors, challengeProposals, studentChallenge, users } from './schema'

export async function dbGetAssessorPending(
    assessorId: string,
){
    const assessor = (
        await db
            .select({ state: assessors.state })
            .from(assessors)
            .where(eq(assessors.assessorId, assessorId))
            .limit(1)
    )[0]

    if (!assessor.state) {
        throw new Error('Assessor profile not found')
    }

    const pendingStatus =
        assessor.state === 'NAT'
            ? 'pending national assessor'
            : 'pending state assessor'

    const proposals = await db
        .select({
            award: challengeProposals.award,
            challenge: challengeProposals.challenge,
            studentId: challengeProposals.studentId,
            type: sql<'proposal'>`'proposal'`,
        })
        .from(challengeProposals)
        .innerJoin(users, eq(challengeProposals.studentId, users.id))
        .where(
            and(
                eq(challengeProposals.status, pendingStatus),
                ...(assessor.state === 'NAT'
                    ? []
                    : [eq(users.state, assessor.state)]),
            ),
        )
    const submissions = await db
        .select({
            award: studentChallenge.award,
            challenge: studentChallenge.challenge,
            studentId: studentChallenge.studentId,
            type: sql<'submission'>`'submission'`,
        })
        .from(studentChallenge)
        .innerJoin(users, eq(studentChallenge.studentId, users.id))
        .where(
            and(
                eq(studentChallenge.status, pendingStatus),
                ...(assessor.state === 'NAT'
                    ? []
                    : [eq(users.state, assessor.state)]),
            ),
        )
    return [...proposals, ...submissions]
}
export async function dbGetAssessorStudents(assessorId: string) {
    const assessor = (
        await db
            .select({ state: assessors.state })
            .from(assessors)
            .where(eq(assessors.assessorId, assessorId))
            .limit(1)
    )[0]

    if (!assessor.state) {
        throw new Error('Assessor profile not found')
    }

    return db
        .select({
            userId: users.id,
            email: users.email,
            role: users.role,
            name: users.name,
            state: users.state,
        })
        .from(users)
        .innerJoin(
            challengeProposals,
            eq(challengeProposals.studentId, users.id),
        )
        .where(
            assessor.state === 'NAT' ? undefined : eq(users.state, assessor.state),
        )
        .groupBy(users.id)
}
