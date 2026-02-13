import { getUserAwardChallenges } from "@/api/challenges";
import { Award } from "@/types/awards";
import { useQuery } from '@tanstack/react-query';
import { queryOptions } from '@tanstack/react-query'
export const challengesQueryOptions = (award: Award, select?: (data: Awaited<ReturnType<typeof getUserAwardChallenges>>) => any) => (queryOptions({
    queryKey: ['challenges', award],
    queryFn: () => getUserAwardChallenges({data: {award}}),
    select,
}))
export function useChallenges(award: Award, select?: (data: Awaited<ReturnType<typeof getUserAwardChallenges>>) => any) {
    return useQuery(challengesQueryOptions(award, select))
}