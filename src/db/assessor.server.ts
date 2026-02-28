import { db } from "./index.server";

import { and, eq } from "drizzle-orm/sql/expressions/conditions";
import {  challengeProposals, users } from "./schema.server";
import { ProposalWithStudent } from "@/types/schemas/proposal";
//TODO: Make this specific to the assessor state and award
export async function dbGetAssessorPendingProposals(assessorId: string): Promise<ProposalWithStudent[]> {
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
    }).from(challengeProposals).innerJoin(users, eq(challengeProposals.mentorId, users.id)).as("proposals");
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
        eq(challengeProposalsSubquery.status, 'pending assessor'),
    )).innerJoin(users, eq(challengeProposalsSubquery.studentId, users.id))
}

export async function dbGetAssessorStudents(assessorId: string) {
    return db.select({
        userId: users.id,
        email: users.email,
        role: users.role,
        name: users.name,
    }).from(users).innerJoin(challengeProposals, eq(challengeProposals.studentId, users.id))
    .groupBy(users.id)
}