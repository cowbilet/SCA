import { and, eq } from 'drizzle-orm/sql/expressions/conditions'
import { sql } from 'drizzle-orm/sql'
import { db } from './index.server'

import { challengeProposals, studentChallenge, users } from './schema'
// TODO: Make this specific to the assessor state and award
export async function dbGetAssessorPending(
    assessorId: string,
){
    const proposals = await db
        .select({
            award: challengeProposals.award,
            challenge: challengeProposals.challenge,
            studentId: challengeProposals.studentId,
            type: sql<'proposal'>`'proposal'`,
        })
        .from(challengeProposals)
        .where(
            and(
                eq(challengeProposals.status, 'pending assessor'),
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
        .where(
            and(
                eq(studentChallenge.status, 'pending assessor'),
            ),
        )
    return [...proposals, ...submissions]
}
export async function dbGetAssessorStudents(_assessorId: string) {
    return db
        .select({
            userId: users.id,
            email: users.email,
            role: users.role,
            name: users.name,
        })
        .from(users)
        .innerJoin(
            challengeProposals,
            eq(challengeProposals.studentId, users.id),
        )
        .groupBy(users.id)
}
