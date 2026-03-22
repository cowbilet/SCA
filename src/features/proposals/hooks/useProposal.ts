import { queryOptions, useQuery } from '@tanstack/react-query'
import { getUserProposal } from '../api/getUserProposal';
import type { Award } from "@/types/awards";
import type { Challenge } from "@/types/challenges";
import { queryKeys } from "@/hooks/queryKeys";

export const proposalQueryOptions = (award: Award, challenge: Challenge, studentId: string, enabled: boolean = !!studentId) => queryOptions({
    queryKey: queryKeys.proposals.detail(award, challenge, studentId),
    queryFn: () => getUserProposal({ data: { award, challenge, studentId } }),
    enabled,
})
export function useProposal(award: Award, challenge: Challenge, studentId: string, enabled: boolean = !!studentId ) {
    return useQuery(proposalQueryOptions(award, challenge, studentId, enabled))
}