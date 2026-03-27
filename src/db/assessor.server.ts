import { and, eq } from 'drizzle-orm/sql/expressions/conditions'
import { db } from './index.server'

import { challengeProposals, users } from './schema'
import type { Proposal } from '@/types/schemas/proposal'
// TODO: Make this specific to the assessor state and award
export async function dbGetAssessorPendingProposals(
    assessorId: string,
): Promise<Array<Proposal>> {
    return await db
        .select({
            studentId: challengeProposals.studentId,
            award: challengeProposals.award,
            challenge: challengeProposals.challenge,
            description: challengeProposals.description,
            goal: challengeProposals.goal,
            mentorNote: challengeProposals.mentorNote,
            assessorNote: challengeProposals.assessorNote,
            accepted: challengeProposals.accepted,
            status: challengeProposals.status,
        })
        .from(challengeProposals)
        .where(
            and(
                eq(challengeProposals.assessorId, assessorId),
                eq(challengeProposals.status, 'pending assessor'),
            ),
        )
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
