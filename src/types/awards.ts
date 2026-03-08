import { awardTiers, status } from "@/db/schema";


export type Award = typeof awardTiers.enumValues[number]


export const ALL_AWARDS: Award[] = awardTiers.enumValues


export type AwardProgress = 'completed' | 'ongoing' | 'locked' | "not started"

export type SubmissionState = typeof status.enumValues[number]