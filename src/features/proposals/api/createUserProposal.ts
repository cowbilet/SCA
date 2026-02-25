import { createServerFn } from "@tanstack/react-start"

import { dbGetUserByEmail, dbGetUserByName } from "@/db/users.server"

import { validateAward } from "@/types/guards/awards"
import type { Award } from "@/types/awards"
import type { Challenge } from "@/types/challenges"
import { z } from "zod"

import { CreateProposalSchema } from "../types/schema/forms"
import { validateChallenge } from "@/types/guards/challenges"

import { Proposal } from "@/types/schemas/proposal"
import { dbCreateUserChallenge, dbGetUserChallenge } from "@/db/challenges.server"
import { dbChangeProposalStatus, dbCreateChallengeProposal, dbEditProposal } from "@/db/proposals.server"
const createUserProposalSchema = CreateProposalSchema.extend({
    award: z.string().refine((award): award is Award => validateAward(award), {
        message: 'Invalid award',
    }),
    challenge: z.string().refine((challenge): challenge is Challenge => validateChallenge(challenge), {
        message: 'Invalid challenge',
    }),
})
export const createUserProposal = createServerFn({ method: 'POST' }).inputValidator(createUserProposalSchema).handler(async ({data}): Promise<Proposal> => {
    const { description, goal, mentorEmail, award, challenge } = data
    // Validate mentor email
    const mentor = await dbGetUserByEmail(mentorEmail)
    if (!mentor || mentor.role !== 'mentor') {
        throw new Error("Invalid mentor email")
    }

    const student = await dbGetUserByName("Student")
    if (!student) {
        throw new Error("User not found")
    }
    const studentId = student.userId
    const mentorId = mentor.userId

    // See if they already have a challenge created
    const challengeData = await dbGetUserChallenge(studentId, award, challenge)
    let proposal = null
    if (challengeData) {
        // Then they have created a challenge before, so we need to check the status of their proposal and update it to pending mentor if it's not already in progress
        const status = challengeData.proposals?.status ?? 'not started'
        if (status === 'pending mentor' || status === 'pending assessor' || status === 'completed') {
            throw new Error("You already have a proposal in progress for this challenge")
        }
        //TODO: Make this a transaction
        await dbChangeProposalStatus(studentId, award, challenge, 'pending mentor')
        proposal = await dbEditProposal(studentId, award, challenge, description, goal)
        
    }
    else {
        // They haven't created a challenge before, so we need to create a new one with their proposal
        await dbCreateUserChallenge(studentId, mentorId, award, challenge)
        proposal = await dbCreateChallengeProposal(studentId, mentorId, award, challenge, description, goal)
    }

    if (!proposal) {
        throw new Error("Failed to create proposal")
    }

    return proposal 
})