import { ALL_AWARDS, ALL_CHALLENGES } from '@/types/SCA'
export function validateAward(award: string): award is typeof ALL_AWARDS[number] {
    return ALL_AWARDS.includes(award as typeof ALL_AWARDS[number])
}
export function validateChallenge(challenge: string): challenge is typeof ALL_CHALLENGES[number] {
    return ALL_CHALLENGES.includes(challenge as typeof ALL_CHALLENGES[number])
}