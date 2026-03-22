import { ALL_AWARDS } from '@/types/awards'

export function validateAward(
    award: string,
): award is (typeof ALL_AWARDS)[number] {
    return ALL_AWARDS.includes(award as (typeof ALL_AWARDS)[number])
}
