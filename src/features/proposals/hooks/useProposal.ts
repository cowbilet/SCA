import { queryOptions, useQuery } from '@tanstack/react-query'
import { getUserProposal } from '../api/getUserProposal';
import { Award } from "@/types/awards";
import { Challenge } from "@/types/challenges";

// proposalQueryOptions.ts
export const proposalQueryOptions = (award: Award, challenge: Challenge, studentId?: string) => queryOptions({
    queryKey: ['proposals', award, challenge, studentId],
    queryFn: () => getUserProposal({ data: { award, challenge, studentId: studentId! } }),
    enabled: !!studentId,  // ← query won't fire until studentId exists
})
export function useProposal(award: Award, challenge: Challenge, studentId?: string ) {
    return useQuery(proposalQueryOptions(award, challenge, studentId))
}