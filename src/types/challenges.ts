import { challenge } from "@/db/schema.server";

export type Challenges = typeof challenge.enumValues[number]
export const ALL_CHALLENGES: Challenges[] = challenge.enumValues
