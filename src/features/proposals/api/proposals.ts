import { createServerFn } from '@tanstack/react-start'

import { getDbUserByEmail, getDbUserByName } from '@/db/users.server'
import { createDbUserAwardChallenge, editDbUserChallenge, getDbUserChallenge } from '@/db/challenges.server'
import { createDbChallengeProposal, getDbChallengeProposal } from '@/db/proposals'
import { validateAward } from '@/types/guards/awards'
import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'
import { z } from 'zod'

import { CreateProposalSchema } from '../types/schema/forms'

import { validateChallenge } from '@/types/guards/challenges'

const createUserProposalSchema = CreateProposalSchema.extend({
    award: z.string().refine((award): award is Award => validateAward(award), {
        message: 'Invalid award',
    }),
    challenge: z.string().refine((challenge): challenge is Challenge => validateChallenge(challenge), {
        message: 'Invalid challenge',
    }),
})
export const createUserProposal = createServerFn({ method: 'POST' }).inputValidator(createUserProposalSchema).handler(async ({data}): Promise<void> => {
    const { description, goal, mentorEmail, award, challenge } = data
    // Validate mentor email
    const mentor = await getDbUserByEmail(mentorEmail)
    if (!mentor || mentor.length === 0 || mentor[0].role !== 'mentor') {
        throw new Error("Invalid mentor email")
    }

    const student = (await getDbUserByName("Seb"))[0]
    const studentId = student.userId
    const mentorId = mentor[0].userId

    // See if they already have a challenge created
    const challengeData = await getDbUserChallenge(studentId, award, challenge)
    // Creating the challenge (if this is their first challenge in this award)
    if (!challengeData || challengeData.length === 0) {
        await createDbUserAwardChallenge(studentId, mentorId, award, challenge, 'pending mentor')
    }
    else {
        const status = challengeData[0].proposalStatus
        if (status === 'pending mentor' || status === 'pending assessor' || status === 'completed') {
            throw new Error("You already have a proposal in progress for this challenge")
        }
        // Update the challenge to pending mentor with the new mentor (if they had a previous proposal that was rejected or they withdrew)
        await editDbUserChallenge(studentId, award, challenge, 'pending mentor', undefined)
    }

    await createDbChallengeProposal(studentId, mentorId, award, challenge, description, goal)
})
const getUserProposalSchema = z.object({
    award: z.string().refine((award): award is Award => validateAward(award), {
        message: 'Invalid award',
    }),
    challenge: z.string().refine((challenge): challenge is Challenge => validateChallenge(challenge), {
        message: 'Invalid challenge',
    }),
})
export const getUserProposal = createServerFn({ method: 'GET' }).inputValidator(getUserProposalSchema).handler(async ({data}) => {
    const { award, challenge } = data
    const student = (await getDbUserByName("Seb"))[0]
    const studentId = student.userId
    
    const proposalData = await getDbChallengeProposal(studentId, award, challenge)
    return proposalData[0] || null
})