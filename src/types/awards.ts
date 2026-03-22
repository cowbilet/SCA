import type { status } from "@/db/schema";
import { awardTiers } from "@/db/schema";


export type Award = typeof awardTiers.enumValues[number]


export const ALL_AWARDS: Array<Award> = awardTiers.enumValues


export type AwardProgress = 'completed' | 'ongoing' | 'locked' | "not started"

export type SubmissionState = typeof status.enumValues[number]