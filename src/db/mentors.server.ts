import { and, eq, isNull, not } from 'drizzle-orm/sql/expressions/conditions'
import { sql } from 'drizzle-orm/sql/sql'
import { db } from './index.server'

import { challengeProposals, logs, studentChallenge, users  } from './schema'

export async function dbGetMentorPending(
    mentorId: string,
){
    const pendingProposals = await db
        .select({
            award: challengeProposals.award,
            challenge: challengeProposals.challenge,
            studentId: challengeProposals.studentId,
            type: sql<'proposal'>`'proposal'`,
        })
        .from(challengeProposals)
        .where(
            and(
                eq(challengeProposals.mentorId, mentorId),
                eq(challengeProposals.status, 'pending mentor'),
            ),
        )
    const pendingSubmissions = await db
        .select({
            award: studentChallenge.award,
            challenge: studentChallenge.challenge,
            studentId: studentChallenge.studentId,
            type: sql<'submission'>`'submission'`,
        })
        .from(studentChallenge)
        .where(
            and(
                eq(studentChallenge.mentorId, mentorId),
                eq(studentChallenge.status, 'pending mentor'),
            ),
        )
    const pendingLogs = await db
        .select({
            award: studentChallenge.award,
            challenge: studentChallenge.challenge,
            studentId: studentChallenge.studentId,
            type: sql<'log'>`'log'`,
        })
        .from(logs)
        .innerJoin(studentChallenge, and(
            eq(logs.studentId, studentChallenge.studentId),
            eq(logs.award, studentChallenge.award),
            eq(logs.challenge, studentChallenge.challenge),
        ))
        .where(
            and(
                eq(studentChallenge.mentorId, mentorId),
                isNull(logs.approved),
                not(eq(studentChallenge.status, 'completed')),
            ),
        )
    return [...pendingProposals, ...pendingSubmissions, ...pendingLogs]
}
export function dbGetMentorStudents(mentorId: string) {
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
        .where(and(eq(challengeProposals.mentorId, mentorId)))
        .groupBy(users.id)
}
