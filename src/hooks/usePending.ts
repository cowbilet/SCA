import { queryOptions, useQuery } from '@tanstack/react-query'
import { getAdvisorPending } from '@/api/advisors/getAdvisorPending'
import { queryKeys } from '@/hooks/queryKeys'

export const usePendingOptions = () => {
    return queryOptions({
        queryKey: queryKeys.pending.list(),
        queryFn: getAdvisorPending,
    })
}
export function usePending() {
    return useQuery(usePendingOptions())
}
