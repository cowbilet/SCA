import { getUserAwardChallenges } from "@/api/challenges";
import { Awards } from "@/types/awards";
import { useQuery } from '@tanstack/react-query';
import { queryOptions } from '@tanstack/react-query'
export const challengesQueryOptions = (award: Awards) => (queryOptions({
    queryKey: ['challenges', award],
    queryFn: () => getUserAwardChallenges({data: {award}}),
}))
export function useChallenges(award: Awards, select?: (data: Awaited<ReturnType<typeof getUserAwardChallenges>>) => any) {
    return useQuery({select, ...challengesQueryOptions(award)})
}