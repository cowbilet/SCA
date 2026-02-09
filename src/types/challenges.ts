import { challenge } from "@/db/schema.server";

export type Challenge = typeof challenge.enumValues[number]
export const ALL_CHALLENGES: Challenge[] = challenge.enumValues
