import { awardTiers, challenge } from "~drizzle/schema.ts";


export type Awards = typeof awardTiers.enumValues[number]
export type Challenges = typeof challenge.enumValues[number]

export const ALL_AWARDS: Awards[] = awardTiers.enumValues
export const ALL_CHALLENGES: Challenges[] = challenge.enumValues

export type AwardProgress = 'completed' | 'ongoing' | 'locked' | "not started"