import { getUserChallenge } from "@/api/challenges";
import { Award } from "@/types/awards";
import { Challenge } from "@/types/challenges";
import { useQuery } from '@tanstack/react-query';
import { queryOptions } from '@tanstack/react-query'
export const challengeQueryOptions = (award: Award, challenge: Challenge) => (queryOptions({
    queryKey: ['challenges', award, challenge],
    queryFn: () => getUserChallenge({data: {award, challenge}}),

}))
export function useChallenge(
    award: Award, 
    challenge: Challenge
) {
    return useQuery(challengeQueryOptions(award, challenge))
}