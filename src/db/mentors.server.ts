import { db } from "./index.server";

import { and, eq } from "drizzle-orm/sql/expressions/conditions";
import {  challengeProposals, users } from "./schema.server";
import { ProposalWithStudent } from "@/types/schemas/proposal";


export async function dbGetMentorPendingProposals(mentorId: string): Promise<ProposalWithStudent[]> {
    const challengeProposalsSubquery = db.select({
        studentId: challengeProposals.studentId,
        award: challengeProposals.award,
        challenge: challengeProposals.challenge,
        description: challengeProposals.description,
        goal: challengeProposals.goal,
        mentorNote: challengeProposals.mentorNote,
        mentorId: challengeProposals.mentorId,
        assessorNote: challengeProposals.assessorNote,
        accepted: challengeProposals.accepted,
        mentorEmail: users.email,
        status: challengeProposals.status,
    }).from(challengeProposals).innerJoin(users, eq(challengeProposals.mentorId, users.userId)).as("proposals");
    
    return await db.select({
        student: {
            userId: challengeProposalsSubquery.studentId,
            email: users.email,
            role: users.role,
            name: users.name,
        },
        proposal: {
            studentId: challengeProposalsSubquery.studentId,
            award: challengeProposalsSubquery.award,
            challenge: challengeProposalsSubquery.challenge,
            description: challengeProposalsSubquery.description,
            goal: challengeProposalsSubquery.goal,
            mentorEmail: challengeProposalsSubquery.mentorEmail,
            mentorNote: challengeProposalsSubquery.mentorNote,
            assessorNote: challengeProposalsSubquery.assessorNote,
            accepted: challengeProposalsSubquery.accepted,
            status: challengeProposalsSubquery.status,
        },
    }).from(challengeProposalsSubquery)
    .where(and(
        eq(challengeProposalsSubquery.mentorId, mentorId),
        eq(challengeProposalsSubquery.status, 'pending mentor'),
    )).innerJoin(users, eq(challengeProposalsSubquery.studentId, users.userId))
}
export function dbGetMentorStudents(mentorId: string) {
    return db.select({
        userId: users.userId,
        email: users.email,
        role: users.role,
        name: users.name,
    }).from(users).innerJoin(challengeProposals, eq(challengeProposals.studentId, users.userId)).where(and(
        eq(challengeProposals.mentorId, mentorId),
        eq(challengeProposals.accepted, true),
    )).groupBy(users.userId)
}