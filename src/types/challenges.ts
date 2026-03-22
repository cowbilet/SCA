import { challenge } from '@/db/schema'

export type Challenge = (typeof challenge.enumValues)[number]
export const ALL_CHALLENGES: Array<Challenge> = challenge.enumValues
