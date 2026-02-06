import { ALL_AWARDS, ALL_CHALLENGES } from '@/types/SCA'
export function validateTier(tier: string): tier is typeof ALL_AWARDS[number] {
    return ALL_AWARDS.includes(tier as typeof ALL_AWARDS[number])
}
export function validateChallenge(challenge: string): challenge is typeof ALL_CHALLENGES[number] {
    return ALL_CHALLENGES.includes(challenge as typeof ALL_CHALLENGES[number])
}