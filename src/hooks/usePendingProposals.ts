import { queryOptions, useQuery } from '@tanstack/react-query'
import { getAdvisorPending } from '@/api/advisors/getAdvisorPending'
import { queryKeys } from '@/hooks/queryKeys'

export const usePendingProposalsOptions = () => {
    return queryOptions({
        queryKey: queryKeys.proposals.pending(),
        queryFn: getAdvisorPending,
    })
}
export function usePendingProposals() {
    return useQuery(usePendingProposalsOptions())
}
