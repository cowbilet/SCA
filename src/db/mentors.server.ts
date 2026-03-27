import { and, eq } from 'drizzle-orm/sql/expressions/conditions'
import { db } from './index.server'

import { challengeProposals, users } from './schema'
import type { Proposal } from '@/types/schemas/proposal'

export async function dbGetMentorPendingProposals(
    mentorId: string,
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
                eq(challengeProposals.mentorId, mentorId),
                eq(challengeProposals.status, 'pending mentor'),
            ),
        )
}
export function dbGetMentorStudents(mentorId: string) {
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
        .where(and(eq(challengeProposals.mentorId, mentorId)))
        .groupBy(users.id)
}
