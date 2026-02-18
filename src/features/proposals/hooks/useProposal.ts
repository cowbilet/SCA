import { queryOptions, useQuery } from '@tanstack/react-query'
import { getUserProposal } from '../api/proposals';
import { Award } from "@/types/awards";
import { Challenge } from "@/types/challenges";

export const proposalQueryOptions = (award: Award, challenge: Challenge) => (queryOptions({
    queryKey: ['challenges', award, challenge],
    queryFn: () => getUserProposal({data: {award, challenge}}),
}))
export function useProposal(award: Award, challenge: Challenge) {
    return useQuery(proposalQueryOptions(award, challenge))
}