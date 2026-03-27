import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'
import { getUserChallenge } from '@/api/challenges/getStudentChallenge'
import { queryKeys } from '@/hooks/queryKeys'

export const challengeQueryOptions = (
    award: Award,
    challenge: Challenge,
    studentId: string,
) =>
    queryOptions({
        queryKey: queryKeys.challenges.detail(award, challenge, studentId),
        queryFn: () =>
            getUserChallenge({ data: { award, challenge, studentId } }),
    })
    
export function useChallenge(
    award: Award,
    challenge: Challenge,
    studentId: string,
) {
    return useQuery(challengeQueryOptions(award, challenge, studentId))
}
