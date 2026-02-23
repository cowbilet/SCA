import { pgTable, uuid, text, foreignKey, boolean, timestamp, primaryKey, pgEnum } from "drizzle-orm/pg-core"


export const awardTiers = pgEnum("award_tiers", ['bronze', 'silver', 'gold'])
export const challenge = pgEnum("challenge", ['challenge', 'service', 'relationships', 'community'])
export const location = pgEnum("location", ['NSW', 'VIC', 'WA', 'QLD', 'TAS', 'SA', 'NAT'])
export const role = pgEnum("role", ['student', 'mentor'])
export const status = pgEnum("application_states", ['not started', 'withdrawn', 'pending mentor', 'rejected mentor', 'pending assessor', 'rejected assessor', 'completed'])


export const assessors = pgTable("assessors", {
	assessorId: uuid().primaryKey().notNull(),
	award: text(),
	state: location(),
});

export const challengeProposals = pgTable("challenge_proposals", {
	studentId: uuid().notNull(),
	award: awardTiers().notNull(),
	challenge: challenge().notNull(),
	description: text().notNull(),
	goal: text().notNull(),
	mentorId: uuid().notNull(),
	assessorId: uuid(),
	mentorNote: text(),
	assessorNote: text(),
	accepted: boolean(),
	status: status().notNull(),
}, (table) => [
	primaryKey({ columns: [table.studentId, table.award, table.challenge], name: "challenge_proposals_pkey"}),
	foreignKey({
			columns: [table.assessorId],
			foreignColumns: [assessors.assessorId],
			name: "challenge_proposals_assessorId_fkey"
		}),
	foreignKey({
			columns: [table.mentorId],
			foreignColumns: [users.userId],
			name: "challenge_proposals_mentorId_fkey"
		}),
	foreignKey({
			columns: [table.studentId, table.award, table.challenge],
			foreignColumns: [studentChallenge.studentId, studentChallenge.award, studentChallenge.challenge],
			name: "challenge_proposals_student_challenge_fkey"
		}),
]);

export const challengeSubmission = pgTable("challenge_submission", {
	studentId: uuid().notNull(),
	award: awardTiers().notNull(),
	challenge: challenge().notNull(),
	assessorId: uuid(),
	studentReflection: text().notNull(),
	mentorReflection: text(),
	assessorReflection: text(),
	accepted: boolean(),
}, (table) => [
	primaryKey({ columns: [table.studentId, table.award, table.challenge], name: "challenge_submission_pkey"}),
	foreignKey({
			columns: [table.assessorId],
			foreignColumns: [assessors.assessorId],
			name: "challenge_submission_assessorId_fkey"
		}),
	foreignKey({
			columns: [table.studentId, table.award, table.challenge],
			foreignColumns: [studentChallenge.studentId, studentChallenge.award, studentChallenge.challenge],
			name: "challenge_submission_student_challenge_fkey"
		}),
]);

export const logs = pgTable("logs", {
	logId: uuid().defaultRandom().primaryKey().notNull(),
	studentId: uuid().notNull(),
	award: awardTiers().notNull(),
	challenge: challenge().notNull(),
	date: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	description: text().notNull(),
	mentorId: uuid().notNull(),
	approved: boolean(),
	evidence: text(),
}, (table) => [
	foreignKey({
		columns: [table.studentId, table.award, table.challenge],
		foreignColumns: [
			studentChallenge.studentId,
			studentChallenge.award,
			studentChallenge.challenge,
		],
		name: "logs_studentId_award_challenge_fkey"
	}),
]);

export const users = pgTable("users", {
	userId: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull().unique(),
	role: role().notNull(),
	name: text().notNull(),
});

export const studentChallenge = pgTable("student_challenge", {
	mentorId: uuid().notNull(),
	studentId: uuid().notNull(),
	award: awardTiers().notNull(),
	challenge: challenge().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.mentorId],
			foreignColumns: [users.userId],
			name: "student_challenge_mentorId_fkey"
		}),
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [users.userId],
			name: "student_challenge_studentId_fkey"
		}),
	primaryKey({ columns: [table.studentId, table.award, table.challenge], name: "student_challenge_pkey"}),
]);
