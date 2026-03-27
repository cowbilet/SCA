import { createServerFn } from '@tanstack/react-start'

import { CreateProposalSchema } from '../types/schema/forms'
import type { Proposal } from '@/types/schemas/proposal'
import { dbGetUserByEmail } from '@/db/users.server'

import {
    dbCreateUserChallenge,
    dbGetStudentChallenge,
} from '@/db/challenges.server'
import {
    dbChangeProposalStatus,
    dbCreateChallengeProposal,
    dbEditProposal,
    dbGetProposal,
} from '@/db/proposals.server'
import { restrictRoles } from '@/utils/auth'
import { awardSchema } from '@/types/schemas/award'
import { challengeSchema } from '@/types/schemas/challenges'

const createUserProposalSchema = CreateProposalSchema.extend({
    award: awardSchema.optional(),
    challenge: challengeSchema.optional(),
})
export const createUserProposal = createServerFn({ method: 'POST' })
    .inputValidator(createUserProposalSchema)
    .handler(async ({ data }): Promise<Proposal> => {
        if (!data.award || !data.challenge) {
            throw new Error('Award and challenge must be provided')
        }
        const student = await restrictRoles({ data: ['student'] })
        const { description, goal, mentorEmail, award, challenge } = data
        // Validate mentor email
        const mentor = await dbGetUserByEmail(mentorEmail)
        if (!mentor || mentor.role !== 'mentor') {
            throw new Error('Invalid mentor email')
        }
        const studentId = student.userId
        const mentorId = mentor.userId

        // See if they already have a challenge created
        const challengeData = await dbGetStudentChallenge(
            studentId,
            award,
            challenge,
        )
        let proposal = null
        if (challengeData) {
            const existingProposal = await dbGetProposal(
                studentId,
                award,
                challenge,
            )
            // Then they have created a challenge before, so we need to check the status of their proposal and update it to pending mentor if it's not already in progress
            const status = existingProposal?.status ?? 'not started'
            if (
                status === 'pending mentor' ||
                status === 'pending state assessor' ||
                status === 'pending national assessor' ||
                status === 'completed'
            ) {
                throw new Error(
                    'You already have a proposal in progress for this challenge',
                )
            }
            if (existingProposal) {
                // TODO: Make this a transaction
                await dbChangeProposalStatus(
                    studentId,
                    award,
                    challenge,
                    'pending mentor',
                )
                proposal = await dbEditProposal(
                    studentId,
                    award,
                    challenge,
                    description,
                    goal,
                )
            } else {
                proposal = await dbCreateChallengeProposal(
                    studentId,
                    mentorId,
                    award,
                    challenge,
                    description,
                    goal,
                )
            }
        } else {
            // They haven't created a challenge before, so we need to create a new one with their proposal
            await dbCreateUserChallenge(studentId, mentorId, award, challenge)
            proposal = await dbCreateChallengeProposal(
                studentId,
                mentorId,
                award,
                challenge,
                description,
                goal,
            )
        }

        if (!proposal) {
            throw new Error('Failed to create proposal')
        }

        return proposal
    })
