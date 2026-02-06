import { awardTiers, challenge, submissionStatus } from "@/db/schema.server";


export type Awards = typeof awardTiers.enumValues[number]
export type Challenges = typeof challenge.enumValues[number]

export const ALL_AWARDS: Awards[] = awardTiers.enumValues
export const ALL_CHALLENGES: Challenges[] = challenge.enumValues

export type AwardProgress = 'completed' | 'ongoing' | 'locked' | "not started"

export type SubmissionState = typeof submissionStatus.enumValues[number]
