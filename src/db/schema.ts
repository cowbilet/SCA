import {
    boolean,
    foreignKey,
    index,
    pgEnum,
    pgTable,
    primaryKey,
    text,
    timestamp,
    uuid,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const awardTiers = pgEnum('award_tiers', ['bronze', 'silver', 'gold'])
export const challenge = pgEnum('challenge', [
    'challenge',
    'service',
    'relationships',
    'community',
])
export const location = pgEnum('location', [
    'NSW',
    'VIC',
    'WA',
    'QLD',
    'TAS',
    'SA',
    'NAT',
])
export const role = pgEnum('role', ['student', 'mentor', 'assessor', 'admin'])
export const status = pgEnum('application_states', [
    'not started',
    'withdrawn',
    'pending mentor',
    'rejected mentor',
    'pending state assessor',
    'rejected state assessor',
    'pending national assessor',
    'rejected national assessor',
    'completed',
])

export const assessors = pgTable('assessors', {
    assessorId: uuid().primaryKey().notNull(),
    award: text(),
    state: location(),
})

export const challengeProposals = pgTable(
    'challenge_proposals',
    {
        studentId: uuid().notNull(),
        award: awardTiers().notNull(),
        challenge: challenge().notNull(),
        description: text().notNull(),
        goal: text().notNull(),
        mentorId: uuid().notNull(),
        stateAssessorId: uuid(),
        nationalAssessorId: uuid(),
        mentorNote: text(),
        stateAssessorNote: text(),
        nationalAssessorNote: text(),
        accepted: boolean(),
        status: status().notNull(),
    },
    (table) => [
        primaryKey({
            columns: [table.studentId, table.award, table.challenge],
            name: 'challenge_proposals_pkey',
        }),
        foreignKey({
            columns: [table.stateAssessorId],
            foreignColumns: [assessors.assessorId],
            name: 'challenge_proposals_stateAssessorId_fkey',
        }),
        foreignKey({
            columns: [table.nationalAssessorId],
            foreignColumns: [assessors.assessorId],
            name: 'challenge_proposals_nationalAssessorId_fkey',
        }),
        foreignKey({
            columns: [table.mentorId],
            foreignColumns: [users.id],
            name: 'challenge_proposals_mentorId_fkey',
        }),
        foreignKey({
            columns: [table.studentId, table.award, table.challenge],
            foreignColumns: [
                studentChallenge.studentId,
                studentChallenge.award,
                studentChallenge.challenge,
            ],
            name: 'challenge_proposals_student_challenge_fkey',
        }),
    ],
)

export const logs = pgTable(
    'logs',
    {
        logId: uuid().defaultRandom().primaryKey().notNull(),
        studentId: uuid().notNull(),
        award: awardTiers().notNull(),
        challenge: challenge().notNull(),
        date: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
        description: text().notNull(),
        approved: boolean(),
        feedback: text(),
        evidence: text().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.studentId, table.award, table.challenge],
            foreignColumns: [
                studentChallenge.studentId,
                studentChallenge.award,
                studentChallenge.challenge,
            ],
            name: 'logs_studentId_award_challenge_fkey',
        }),
    ],
)

export const studentChallenge = pgTable(
    'student_challenge',
    {
        mentorId: uuid().notNull(),
        stateAssessorId: uuid(),
        nationalAssessorId: uuid(),
        studentId: uuid().notNull(),
        award: awardTiers().notNull(),
        challenge: challenge().notNull(),
        status: status().default('not started').notNull(),
        accepted: boolean(),
        reflection: text(),
        mentorNote: text(),
        stateAssessorNote: text(),
        nationalAssessorNote: text(),
    },
    (table) => [
        foreignKey({
            columns: [table.mentorId],
            foreignColumns: [users.id],
            name: 'student_challenge_mentorId_fkey',
        }),
        foreignKey({
            columns: [table.studentId],
            foreignColumns: [users.id],
            name: 'student_challenge_studentId_fkey',
        }),
        foreignKey({
            columns: [table.stateAssessorId],
            foreignColumns: [assessors.assessorId],
            name: 'student_challenge_stateAssessorId_fkey',
        }),
        foreignKey({
            columns: [table.nationalAssessorId],
            foreignColumns: [assessors.assessorId],
            name: 'student_challenge_nationalAssessorId_fkey',
        }),
        primaryKey({
            columns: [table.studentId, table.award, table.challenge],
            name: 'student_challenge_pkey',
        }),
    ],
)

// Auth stuff
export const users = pgTable('users', {
    id: uuid('userId').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    state: location('state').notNull(),
    role: role('role').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
})

export const sessions = pgTable(
    'sessions',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        expiresAt: timestamp('expires_at').notNull(),
        token: text('token').notNull().unique(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text('ip_address'),
        userAgent: text('user_agent'),
        userId: uuid('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
    },
    (table) => [index('session_userId_idx').on(table.userId)],
)

export const accounts = pgTable(
    'accounts',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        accountId: text('account_id').notNull(),
        providerId: text('provider_id').notNull(),
        userId: uuid('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        accessToken: text('access_token'),
        refreshToken: text('refresh_token'),
        idToken: text('id_token'),
        accessTokenExpiresAt: timestamp('access_token_expires_at'),
        refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
        scope: text('scope'),
        password: text('password'),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index('account_userId_idx').on(table.userId)],
)

export const verifications = pgTable(
    'verifications',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        identifier: text('identifier').notNull(),
        value: text('value').notNull(),
        expiresAt: timestamp('expires_at').notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index('verification_identifier_idx').on(table.identifier)],
)

export const userRelations = relations(users, ({ many }) => ({
    sessions: many(sessions),
    accounts: many(accounts),
}))

export const sessionRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}))

export const accountRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}))
