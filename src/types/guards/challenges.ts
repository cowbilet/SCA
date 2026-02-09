import { ALL_CHALLENGES } from '@/types/challenges'
export function validateChallenge(challenge: string): challenge is typeof ALL_CHALLENGES[number] {
    return ALL_CHALLENGES.includes(challenge as typeof ALL_CHALLENGES[number])
}